const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../src/api');
const {
  generateAccessToken,
  generateToken
} = require('../src/utils/controller.utils');
const sendEmail = require('../src/services/sendEmail.service');
const Doctor = require('../src/models/Doctor.model');

jest.mock('../src/services/sendEmail.service');
jest.mock('../src/utils/controller.utils');
describe('Doctor Controller Tests', () => {
  let doctorId;
  let authToken;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/healthhub_test'
    );

    await Doctor.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/doctors', () => {
    beforeEach(() => {
      generateToken.mockImplementation((user, req, expiry, role) => {
        if (role === 'verify') return 'verify-token-123';
        if (role === 'refresh') return 'refresh-token-123';
        return 'some-token';
      });

      generateAccessToken.mockImplementation((user) => 'mock-access-token');

      sendEmail.mockResolvedValue(true);
    });

    test('should register a new doctor successfully', async () => {
      const doctorData = {
        email: 'newdoctor@example.com',
        firstName: 'New',
        lastName: 'Doctor',
        password: 'password123',
        phoneNumber: '1234567890'
      };

      const response = await request(app)
        .post('/api/v1/doctors')
        .send(doctorData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Doctor registered successfully');
      expect(response.body.doctor).toBeDefined();
      expect(response.body.doctor.email).toBe(doctorData.email);
      expect(response.body.doctor.firstName).toBe(doctorData.firstName);
      expect(response.body.doctor.lastName).toBe(doctorData.lastName);
      expect(response.body.doctor.phoneNumber).toBe(doctorData.phoneNumber);
      expect(response.body.accessToken).toBe('mock-access-token');
      expect(response.headers['set-cookie']).toBeDefined();

      expect(sendEmail).toHaveBeenCalledWith(
        doctorData.email,
        'Verify Your HealthHub Account',
        'accountCreated',
        expect.objectContaining({
          name: doctorData.firstName,
          email: doctorData.email,
          verificationLink: expect.stringContaining('verify-token-123')
        })
      );

      const doctor = await Doctor.findOne({ email: doctorData.email });
      doctorId = doctor._id.toString();
    });

    test('should fail registration with missing fields', async () => {
      const incompleteData = {
        email: 'incomplete@example.com',
        firstName: 'Incomplete'
      };

      const response = await request(app)
        .post('/api/v1/doctors')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
      expect(sendEmail).not.toHaveBeenCalled();
    });

    test('should fail registration with duplicate email', async () => {
      const duplicateData = {
        email: 'newdoctor@example.com',
        firstName: 'Another',
        lastName: 'Doctor',
        password: 'password456',
        phoneNumber: '0987654321'
      };

      const response = await request(app)
        .post('/api/v1/doctors')
        .send(duplicateData);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe(
        'A doctor with that email already exists'
      );
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('Protected Doctor Routes', () => {
    beforeAll(async () => {
      const passwordHash = await bcrypt.hash('testpassword', 10);
      const authDoctor = new Doctor({
        firstName: 'Auth',
        lastName: 'Doctor',
        email: 'authdoctor@example.com',
        passwordHash,
        phoneNumber: '5555555555',
        verified: true,
        isActive: true
      });

      await authDoctor.save();

      authToken = `Bearer mock-auth-token-${authDoctor._id}`;

      jest.mock('../middleware/auth.middleware', () => ({
        authenticateToken: (req, res, next) => {
          if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer mock-auth-token-')
          ) {
            const id = req.headers.authorization.split('-').pop();
            req.user = { id, role: 'doctor' };
            return next();
          }
          return res.status(401).json({ error: 'Unauthorized' });
        }
      }));
    });

    describe('GET /api/v1/doctors', () => {
      test('should get all doctors', async () => {
        const response = await request(app)
          .get('/api/v1/doctors')
          .set('Authorization', authToken);

        expect(response.status).toBe(200);
        expect(response.body.doctors).toBeDefined();
        expect(Array.isArray(response.body.doctors)).toBe(true);
        expect(response.body.doctors.length).toBeGreaterThanOrEqual(2);
      });

      test('should filter doctors by isActive', async () => {
        const response = await request(app)
          .get('/api/v1/doctors?isActive=true')
          .set('Authorization', authToken);

        expect(response.status).toBe(200);
        expect(response.body.doctors).toBeDefined();
        expect(Array.isArray(response.body.doctors)).toBe(true);

        response.body.doctors.forEach((doctor) => {
          expect(doctor.isActive).toBe(true);
        });
      });

      test('should filter doctors by verified status', async () => {
        const response = await request(app)
          .get('/api/v1/doctors?verified=true')
          .set('Authorization', authToken);

        expect(response.status).toBe(200);
        expect(response.body.doctors).toBeDefined();

        response.body.doctors.forEach((doctor) => {
          expect(doctor.verified).toBe(true);
        });
      });

      test('should populate patients when requested', async () => {
        const response = await request(app)
          .get('/api/v1/doctors?populatePatients=true')
          .set('Authorization', authToken);

        expect(response.status).toBe(200);
        expect(response.body.doctors).toBeDefined();
      });

      test('should fail without authentication', async () => {
        const response = await request(app).get('/api/v1/doctors');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
      });
    });

    describe('GET /api/v1/doctors/:id', () => {
      test('should get doctor by ID', async () => {
        const response = await request(app)
          .get(`/api/v1/doctors/${doctorId}`)
          .set('Authorization', authToken);

        expect(response.status).toBe(200);
        expect(response.body.doctor).toBeDefined();

        const doctor = Array.isArray(response.body.doctor)
          ? response.body.doctor[0]
          : response.body.doctor;

        expect(doctor._id).toBe(doctorId);
        expect(doctor.email).toBe('newdoctor@example.com');
      });

      test('should fail with invalid doctor ID format', async () => {
        const response = await request(app)
          .get('/api/v1/doctors/invalid-id')
          .set('Authorization', authToken);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid doctor ID format');
      });

      test('should fail without authentication', async () => {
        const response = await request(app).get(`/api/v1/doctors/${doctorId}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
      });
    });

    describe('PUT /api/v1/doctors/:id', () => {
      const authDoctorId = authToken.split('-').pop();

      test('should update doctor details when user is the doctor', async () => {
        const updateData = {
          firstName: 'Updated',
          lastName: 'Doctor',
          phoneNumber: '9999999999'
        };

        const response = await request(app)
          .put(`/api/v1/doctors/${authDoctorId}`)
          .set('Authorization', authToken)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Doctor updated successfully');
        expect(response.body.doctor).toBeDefined();
        expect(response.body.doctor.firstName).toBe(updateData.firstName);
        expect(response.body.doctor.lastName).toBe(updateData.lastName);
        expect(response.body.doctor.phoneNumber).toBe(updateData.phoneNumber);

        const updatedDoctor = await Doctor.findById(authDoctorId);
        expect(updatedDoctor.firstName).toBe(updateData.firstName);
        expect(updatedDoctor.lastName).toBe(updateData.lastName);
        expect(updatedDoctor.phoneNumber).toBe(updateData.phoneNumber);
      });

      test('should fail when user is not the doctor', async () => {
        const updateData = {
          firstName: 'Unauthorized',
          lastName: 'Update',
          phoneNumber: '1111111111'
        };

        const response = await request(app)
          .put(`/api/v1/doctors/${doctorId}`)
          .set('Authorization', authToken)
          .send(updateData);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Not allowed to update this profile');

        const unchangedDoctor = await Doctor.findById(doctorId);
        expect(unchangedDoctor.firstName).not.toBe(updateData.firstName);
      });

      test('should fail with invalid doctor ID format', async () => {
        const response = await request(app)
          .put('/api/v1/doctors/invalid-id')
          .set('Authorization', authToken)
          .send({ firstName: 'Test' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid doctor ID format');
      });

      test('should fail without authentication', async () => {
        const response = await request(app)
          .put(`/api/v1/doctors/${doctorId}`)
          .send({ firstName: 'Test' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
      });
    });

    describe('DELETE /api/v1/doctors/:id', () => {
      const authDoctorId = authToken.split('-').pop();

      test('should deactivate doctor when user is the doctor', async () => {
        const response = await request(app)
          .delete(`/api/v1/doctors/${authDoctorId}`)
          .set('Authorization', authToken);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Doctor deactivated successfully');

        const deactivatedDoctor = await Doctor.findById(authDoctorId);
        expect(deactivatedDoctor).toBeDefined();
        expect(deactivatedDoctor.isActive).toBe(false);
      });

      test('should fail when user is not the doctor', async () => {
        const response = await request(app)
          .delete(`/api/v1/doctors/${doctorId}`)
          .set('Authorization', authToken);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Not allowed to delete this doctor');

        const unchangedDoctor = await Doctor.findById(doctorId);
        expect(unchangedDoctor.isActive).not.toBe(false);
      });

      test('should fail with invalid doctor ID format', async () => {
        const response = await request(app)
          .delete('/api/v1/doctors/invalid-id')
          .set('Authorization', authToken);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid doctor ID format');
      });

      test('should fail without authentication', async () => {
        const response = await request(app).delete(
          `/api/v1/doctors/${doctorId}`
        );

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
      });
    });
  });
});
