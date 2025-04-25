const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor.model');
const sendEmail = require('../services/sendEmail.service');
const { CLIENT_URL } = require('../config/env.config');
const {
  generateAccessToken,
  generateToken,
  ms
} = require('../utils/controller.utils');
const { emailData } = require('../utils/emails.util');

/**
 * Register a New doctor
 * @route: POST /api/version/doctors
 * @body: { email, firstName, lastName, password, phoneNumber}
 * @access: Public (Any doctor can Register)
 */

const registerNewDoctor = async (req, res) => {
  try {
    const { email, firstName, lastName, password, phoneNumber } = req.body;

    if (!email || !firstName || !lastName || !password || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const doctorExists = await Doctor.findOne({ email });

    if (doctorExists) {
      return res
        .status(409)
        .json({ error: 'A doctor with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const doctor = new Doctor({
      email,
      firstName,
      lastName,
      phoneNumber,
      passwordHash
    });

    await doctor.save();

    const verifyToken = await generateToken(doctor, req, '2h', 'verify');
    const refreshToken = await generateToken(doctor, req, '15d', 'refresh');
    const accessToken = generateAccessToken(doctor);

    const data = {
      ...emailData,
      currentYear: new Date().getFullYear(),
      name: doctor.firstName,
      email: doctor.email,
      verificationLink: `${CLIENT_URL}/auth/verify/${doctor.id}?token=${verifyToken}`
    };

    await sendEmail(
      doctor.email,
      'Verify Your HealthHub Account',
      'accountCreated',
      data
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms('15d')
    });

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: doctor.toJSON(),
      accessToken
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: error.message });
  }
};

/**
 * List all doctors
 * @route: GET /api/version/doctors
 * @params: ?populatePatients=true&isActive=true&verified=true
 * @access: Private (Anyone that's logged in)
 * @auth: Bearer Token
 */

const getAllDoctors = async (req, res) => {
  try {
    const { isActive, verified } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (verified !== undefined) {
      filter.verified = verified === 'true';
    }

    let query = Doctor.find(filter);

    if (req.query.populatePatients === 'true') {
      query = query.populate('assignedPatients', 'firstName lastName email');
    }

    const doctors = await query.exec();

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Retrive Doctor's details by ID
 * @route: GET /api/version/doctors/doctorId
 * @params: ?populatePatients=true
 * @access: Private (Anyone that's logged in)
 * @auth: Bearer Token
 */

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = Doctor.find({ _id: id });

    if (req.query.populatePatients === 'true') {
      query = query.populate('assignedPatients', 'firstName lastName email');
    }

    const doctor = await query.exec();

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid doctor ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update a doctor's details
 * @route: PUT /api/version/doctors/doctorId
 * @access: Private (The Actual Doctor)
 * @auth: Bearer Token
 */

const updateDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, isActive } = req.body;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ error: 'Not allowed to update this profile' });
    }

    if (firstName) doctor.firstName = firstName;
    if (lastName) doctor.lastName = lastName;
    if (phoneNumber) doctor.phoneNumber = phoneNumber;
    if (isActive !== undefined) doctor.isActive = isActive;

    await doctor.save();

    return res
      .status(200)
      .json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid doctor ID format' });
    }

    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete a doctor's profile
 * @route: DELETE /api/version/doctors/doctorId
 * @access: Private (The Actual Doctor)
 * @auth: Bearer Token
 */

const deleteDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ error: 'Not allowed to delete this doctor' });
    }

    doctor.isActive = false;
    await doctor.save();

    return res.status(200).json({ message: 'Doctor deactivated successfully' });
  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid doctor ID format' });
    }

    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerNewDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorDetails,
  deleteDoctorById
};
