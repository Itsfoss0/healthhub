/*
 * utility functions used in the
 * controllers of the app
 * ms - converts duration unit string
 * into miliseconds to be used in
 * generating access and refresh tokens
 * geting Device type from user agent headers
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const { JWT_SECRET } = require('../config/env.config');
const Token = require('../models/Token.model');

const capitalize = (word) => {
  return String(word).charAt(0).toUpperCase() + String(word).slice(1);
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActives
    },
    JWT_SECRET,
    { expiresIn: '30m' }
  );
};

const generateToken = async (user, req, expires, role) => {
  const token = crypto.randomBytes(12).toString('hex');
  const TOKEN_EXPIRES_IN_MS = ms(expires);

  const expiresAt = new Date(Date.now() + TOKEN_EXPIRES_IN_MS);

  await Token.create({
    userId: user.id,
    token,
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
    userType: capitalize(user.role),
    expiresAt,
    role
  });

  return token;
};

const getDeviceInfoFromUserAgent = (req) => {
  const userAgentHeader = req.headers['user-agent'];
  const parser = new UAParser(userAgentHeader);
  return parser.getResult();
};

const ms = (duration) => {
  const regex = /^(\d+)([smhdw])$/;
  const match = regex.exec(duration);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000
  };

  return value * units[unit];
};

module.exports = {
  generateAccessToken,
  generateToken,
  ms,
  getDeviceInfoFromUserAgent
};
