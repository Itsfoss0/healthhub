const Doctor = require('../models/Doctor.model');
const Token = require('../models/Token.model');
const Patient = require('../models/Patient.model');
const bcrypt = require('bcrypt');
const { emailData } = require('../utils/emails.util');
const { CLIENT_URL } = require('../config/env.config');
const sendEmail = require('../services/sendEmail.service');
const {
  generateToken,
  generateAccessToken,
  ms,
  getDeviceInfoFromUserAgent
} = require('../utils/controller.utils');

/**
 * Verify a Doctor's account
 * @route: POST /api/version/auth/verify/doctorId
 * @params: ?token=someverficationtoken
 * @access: Public (A doctor with an account)
 */

const verifyAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.query.token;
    const user = await Doctor.findById(id);
    const VerifyToken = await Token.findOne({
      userId: id,
      token,
      role: 'verify'
    });

    if (VerifyToken === null) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    if (VerifyToken) {
      await Doctor.updateOne(
        { _id: id },
        { $set: { verified: true } },
        { new: true }
      );

      await VerifyToken.deleteOne();
      const data = {
        ...emailData,
        name: user.firstName,
        loginLink: `${CLIENT_URL}/auth/login`,
        currentYear: new Date().getFullYear(),
        email: user.email
      };
      await sendEmail(
        user.email,
        'Your Account has been verified',
        'accountVerified',
        data
      );

      res.json({
        status: 'success',
        message: 'Account verified successfully',
        name: user.firstName
      });
    } else {
      res
        .status(403)
        .json({ status: 'error', message: 'Invalid verification token' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Login to an account
 * @route: POST /api/version/auth/login
 * @body: {email, password, loginAs}
 * @access: Public ( Use it to obtain the token pairs)
 */

const loginToAccount = async (req, res) => {
  try {
    const { email, password, loginAs } = req.body;
    let user;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    if (loginAs === 'doctor') {
      user = await Doctor.findOne({ email });
    } else if (loginAs === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      return res
        .status(400)
        .json({ error: 'Can only login as doctor or patient' });
    }

    if (!user) {
      return res.status(404).json({ message: 'no user with such email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'invalid username or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateToken(user, req, '15d', 'refresh');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      securee: true,
      sameSite: 'strict',
      maxAge: ms('15d')
    });

    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error during login',
      error: error.message
    });
  }
};

/**
 * Refresh an accessToken after it has expired (15mins)
 * @route: POST /api/version/auth/token/refresh
 * @cookie: refreshToken=somerefreshtokenval
 * @access: Private (Logged in users only)
 * @auth: HTTP Only Cookie (refreshToken)
 */

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    let user;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const tokenDoc = await Token.findOne({
      token: refreshToken,
      isValid: true,
      role: 'refresh',
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired refresh token' });
    }

    if (tokenDoc.userType === 'Doctor') {
      user = await Doctor.findById(tokenDoc.userId);
    } else if (tokenDoc.userType === 'Patient') {
      user = await Patient.findById(tokenDoc.userId);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'internal server error'
    });
  }
};

/**
 * Check if password can be updated
 * @route: GET /api/version/auth/password/userId
 * @params: ?token=sometoken
 * @access: Public
 */

const allowUpdatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.query.token;

    let user;

    const resetToken = await Token.findOne({
      role: 'reset',
      token
    });

    if (!resetToken) {
      return res.status(404).json({ error: 'token not found or has expired' });
    }

    if (resetToken.userType === 'Doctor') {
      user = await Doctor.findById(id);
    } else if (resetToken.userType === 'Patient') {
      user = await Patient.findById(id);
    }

    if (!user) {
      return res.status(404).json({ error: 'no user found with this Id' });
    }

    return res.json({
      message: 'password change allowed',
      userName: user.firstName
    });
  } catch (err) {
    console.error(err.message);
    return res.status(503).json({ error: 'an error occured on the server' });
  }
};

/**
 * Forgot a password
 * @route: POST /api/version/password/forgot
 * @body: { email, accountType }
 * @access: Public
 */

const resetPassword = async (req, res) => {
  try {
    const { email, accountType } = req.body;

    let user;

    if (accountType === 'doctor') {
      user = await Doctor.findOne({ email });
    } else if (accountType === 'patient') {
      user = await Patient.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ error: 'No user with such email exists' });
    }

    const token = await generateToken(user, req, '2h', 'reset');

    const data = {
      ...emailData,
      name: user.firstName,
      email: user.email,
      resetLink: `${CLIENT_URL}/auth/reset/${user.id}?token=${token}`
    };

    await sendEmail(
      user.email,
      'Reset your HealthHub password',
      'resetPassword',
      data
    );
    return res.json({
      message: 'Reset instructions have been sent to your email'
    });
  } catch (error) {
    console.error(error.message);
    return res.status(503).json({ error: error.message });
  }
};

/**
 * Reset (change) a forgotten password
 * @route: POST /api/version/password/userId/reset
 * @body: {password }
 * @params: ?token=somepasswordresetToken
 * @access: Public (We'll use the reset token and userId to verify)
 */

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const token = req.query.token;

    let user;

    if (!password) {
      return res.status(400).json({
        message: 'New Password is required'
      });
    }

    const resetToken = await Token.findOne({
      role: 'reset',
      token
    });

    if (!resetToken) {
      return res.status(404).json({ error: 'token not found or has expired' });
    }

    if (resetToken.userType === 'Doctor') {
      user = await Doctor.findById(id);
    } else if (resetToken.userType === 'Patient') {
      user = await Patient.findById(id);
    }

    if (!user) {
      return res.status(404).json({ error: 'no user found with this Id' });
    }

    const newPasswordHash = await bcrypt.hash(password, 10);

    user.passwordHash = newPasswordHash;
    await user.save();
    await resetToken.deleteOne();

    const device = getDeviceInfoFromUserAgent(req);
    const browser = `${device.browser.name} on ${device.os.name}`;

    const data = {
      ...emailData,
      name: user.firstName,
      resetTime: new Date().toLocaleString(),
      resetIP: req.ip,
      resetDevice: browser
    };

    await sendEmail(
      user.email,
      'Your password has successfully been reset',
      'sucessPasswordReset',
      data
    );

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error changing password',
      error: error.message
    });
  }
};

module.exports = {
  verifyAccount,
  loginToAccount,
  refreshToken,
  resetPassword,
  allowUpdatePassword,
  updatePassword
};
