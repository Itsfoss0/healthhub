const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../src/api');
const {
  generateAccessToken,
  generateToken
} = require('../src/utils/controller.utils');
const { CLIENT_URL } = require('../src/config/env.config');
const sendEmail = require('../src/services/sendEmail.service');
const Patient = require('../src/models/Patient.model');
const Doctor = require('../src/models/Doctor.model');
const Token = require('../src/models/Token.model');

jest.mock('../src/services/sendEmail.service');
jest.mock('../src/utils/controller.utils');

describe('Auth Controller Tests', () => {
  let doctorId;
  let patientId;
  let verificationToken;
  let resetToken;
  let refreshTokenValue;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI_TEST || 'mongodb://localhost/healthhub_test'
    );

    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Token.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/login', () => {
    beforeAll(async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      const doctor = new Doctor({
        firstName: 'John',
        lastName: 'Doe',
        email: 'doctor@example.com',
        passwordHash,
        verified: true
      });
      await doctor.save();
      doctorId = doctor._id.toString();

      const patient = new Patient({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'patient@example.com',
        passwordHash,
        verified: true
      });
      await patient.save();
      patientId = patient._id.toString();

      generateAccessToken.mockImplementation(
        (user) => `mock-access-token-for-${user._id}`
      );
      generateToken.mockImplementation((user, req, expiry, role) => {
        refreshTokenValue = `mock-refresh-token-for-${user._id}`;
        return refreshTokenValue;
      });
    });

    test('should login successfully as doctor', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'doctor@example.com',
        password: 'password123',
        loginAs: 'doctor'
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('doctor@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    test('should login successfully as patient', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'patient@example.com',
        password: 'password123',
        loginAs: 'patient'
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('patient@example.com');
    });

    test('should fail login with invalid password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'doctor@example.com',
        password: 'wrongpassword',
        loginAs: 'doctor'
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('invalid username or password');
    });

    test('should fail login with non-existent email', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
        loginAs: 'doctor'
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('no user with such email');
    });

    test('should fail login with missing credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        loginAs: 'doctor'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    test('should fail login with invalid loginAs value', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'doctor@example.com',
        password: 'password123',
        loginAs: 'admin'
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Can only login as doctor or patient');
    });
  });

  describe('GET /api/v1/auth/verify/:id', () => {
    beforeAll(async () => {
      verificationToken = new Token({
        userId: doctorId,
        token: 'verification-token-123',
        userType: 'Doctor',
        role: 'verify',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      await verificationToken.save();
    });

    test('should verify account successfully', async () => {
      sendEmail.mockResolvedValue(true);

      const response = await request(app)
        .get(`/api/v1/auth/verify/${doctorId}`)
        .query({ token: 'verification-token-123' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Account verified successfully');
      expect(response.body.name).toBe('John');

      const doctor = await Doctor.findById(doctorId);
      expect(doctor.verified).toBe(true);

      const token = await Token.findOne({ userId: doctorId, role: 'verify' });
      expect(token).toBeNull();

      expect(sendEmail).toHaveBeenCalledWith(
        'doctor@example.com',
        'Your Account has been verified',
        'accountVerified',
        expect.objectContaining({
          name: 'John',
          loginLink: `${CLIENT_URL}/auth/login`,
          email: 'doctor@example.com'
        })
      );
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .get(`/api/v1/auth/verify/${doctorId}`)
        .query({ token: 'invalid-token' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('POST /api/v1/auth/token/refresh', () => {
    beforeAll(async () => {
      const refreshToken = new Token({
        userId: doctorId,
        token: 'refresh-token-123',
        userType: 'Doctor',
        role: 'refresh',
        isValid: true,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      });
      await refreshToken.save();

      generateAccessToken.mockImplementation(
        (user) => `new-access-token-for-${user._id}`
      );
    });

    test('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/token/refresh')
        .set('Cookie', ['refreshToken=refresh-token-123']);

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBe(
        `new-access-token-for-${doctorId}`
      );
    });

    test('should fail with missing refresh token', async () => {
      const response = await request(app).post('/api/v1/auth/token/refresh');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Refresh token required');
    });

    test('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/token/refresh')
        .set('Cookie', ['refreshToken=invalid-token']);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired refresh token');
    });
  });

  describe('POST /api/v1/auth/password/forgot', () => {
    beforeEach(() => {
      sendEmail.mockClear();
      generateToken.mockImplementation(
        (user, req, expiry, role) => 'reset-token-123'
      );
    });

    test('should send password reset email for doctor', async () => {
      const response = await request(app)
        .post('/api/v1/auth/password/forgot')
        .send({
          email: 'doctor@example.com',
          accountType: 'doctor'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Reset instructions have been sent to your email'
      );
      expect(sendEmail).toHaveBeenCalledWith(
        'doctor@example.com',
        'Reset your HealthHub password',
        'resetPassword',
        expect.objectContaining({
          name: 'John',
          email: 'doctor@example.com',
          resetLink: `${CLIENT_URL}/auth/reset/${doctorId}?token=reset-token-123`
        })
      );
    });

    test('should send password reset email for patient', async () => {
      const response = await request(app)
        .post('/api/v1/auth/password/forgot')
        .send({
          email: 'patient@example.com',
          accountType: 'patient'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Reset instructions have been sent to your email'
      );
      expect(sendEmail).toHaveBeenCalledWith(
        'patient@example.com',
        'Reset your HealthHub password',
        'resetPassword',
        expect.objectContaining({
          name: 'Jane',
          email: 'patient@example.com',
          resetLink: `${CLIENT_URL}/auth/reset/${patientId}?token=reset-token-123`
        })
      );
    });

    test('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/password/forgot')
        .send({
          email: 'nonexistent@example.com',
          accountType: 'doctor'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No user with such email exists');
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/auth/password/:id', () => {
    beforeAll(async () => {
      resetToken = new Token({
        userId: doctorId,
        token: 'reset-token-456',
        userType: 'Doctor',
        role: 'reset',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      });
      await resetToken.save();
    });

    test('should allow password update with valid token', async () => {
      const response = await request(app)
        .get(`/api/v1/auth/password/${doctorId}`)
        .query({ token: 'reset-token-456' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('password change allowed');
      expect(response.body.userName).toBe('John');
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .get(`/api/v1/auth/password/${doctorId}`)
        .query({ token: 'invalid-token' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('token not found or has expired');
    });

    test('should fail with invalid user ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/auth/password/${fakeId}`)
        .query({ token: 'reset-token-456' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('no user found with this Id');
    });
  });

  describe('POST /api/v1/auth/password/:id/reset', () => {
    beforeEach(async () => {
      sendEmail.mockClear();

      const existingToken = await Token.findOne({ token: 'reset-token-456' });
      if (!existingToken) {
        const newResetToken = new Token({
          userId: doctorId,
          token: 'reset-token-456',
          userType: 'Doctor',
          role: 'reset',
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
        });
        await newResetToken.save();
      }
    });

    test('should update password successfully', async () => {
      const response = await request(app)
        .post(`/api/v1/auth/password/${doctorId}/reset`)
        .query({ token: 'reset-token-456' })
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset successfully');

      const doctor = await Doctor.findById(doctorId);
      const isPasswordChanged = await bcrypt.compare(
        'newpassword123',
        doctor.passwordHash
      );
      expect(isPasswordChanged).toBe(true);

      const token = await Token.findOne({ token: 'reset-token-456' });
      expect(token).toBeNull();

      expect(sendEmail).toHaveBeenCalledWith(
        'doctor@example.com',
        'Your password has successfully been reset',
        'sucessPasswordReset',
        expect.objectContaining({
          name: 'John',
          resetTime: expect.any(String),
          resetIP: expect.any(String),
          resetDevice: expect.any(String)
        })
      );
    });

    test('should fail with missing password', async () => {
      const response = await request(app)
        .post(`/api/v1/auth/password/${doctorId}/reset`)
        .query({ token: 'reset-token-456' })
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('New Password is required');
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .post(`/api/v1/auth/password/${doctorId}/reset`)
        .query({ token: 'invalid-token' })
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('token not found or has expired');
    });

    test('should fail with invalid user ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/v1/auth/password/${fakeId}/reset`)
        .query({ token: 'reset-token-456' })
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('no user found with this Id');
    });
  });
});
