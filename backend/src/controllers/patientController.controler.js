const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Patient = require('../models/Patient.model');
const Doctor = require('../models/Doctor.model');
const sendEmail = require('../services/sendEmail.service');
const { CLIENT_URL } = require('../config/env.config');
const { emailData } = require('../utils/emails.util');
const { generateToken } = require('../utils/controller.utils');

/**
 * Register a new patient
 * Only a doctor can register a new patient
 * and have a random password assigned to them
 * @route: POST /api/version/patients
 * @body: {firstName, lastName, dateOfBirth, gender, phoneNumber}
 * @access: Private (Restricted to doctors only)
 */

const registerNewPatient = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      emergencyContact
    } = req.body;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !phoneNumber
    ) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return res
        .status(409)
        .json({ error: 'A patient with that email already exists' });
    }

    const password = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    const patient = new Patient({
      email,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      emergencyContact,
      passwordHash
    });

    await patient.save();

    const refreshToken = await generateToken(patient, req, '15d', 'refresh');
    console.log(refreshToken);

    const data = {
      ...emailData,
      doctorName: req.user.firstName,
      name: patient.firstName,
      email: patient.email,
      tempPassword: password,
      loginLink: `${CLIENT_URL}/auth/login`
    };

    await sendEmail(
      patient.email,
      'You have been added to our healthcare system ',
      'patientAccountCreated',
      data
    );

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: patient.toJSON()
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: error.message });
  }
};

/** Retrieve Patients with additional
 * Filtering
 * @route: GET /api/version/patients
 * @params: isActive=true&doctorId=doctor&populateDoctors=true
 *          &populatePrograms=true
 * @access: Private (Doctors only)
 */

const getAllPatients = async (req, res) => {
  try {
    const { isActive, doctorId, programId } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (doctorId) {
      filter.assignedDoctors = doctorId;
    }

    if (programId) {
      filter['programHistory.program'] = programId;
    }

    let query = Patient.find(filter);

    if (req.query.populateDoctors === 'true') {
      query = query.populate('assignedDoctors', 'firstName lastName email');
    }

    if (req.query.populatePrograms === 'true') {
      query = query.populate('programHistory.program');
    }

    const patients = await query.exec();

    return res.status(200).json({ patients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/** Retrieve specific patient's details
 * With optional population of programs
 * or assigened doctors
 * @route:  GET /api/version/patients/patientID
 * @params: doctor=true&programs=true
 * @access: Private (Doctors only)
 */

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populateDoctors, populatePrograms } = req.query;

    let query = Patient.findById(id);

    if (populateDoctors === 'true') {
      query = query.populate('assignedDoctors', 'firstName lastName email');
    }

    if (populatePrograms === 'true') {
      query = query.populate('programHistory.program');
    }

    const patient = await query.exec();

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid patient ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/** Update a patients details
 * @route: PUT /api/version/patients/patientID
 * @access: Private (Doctor and the actual patient only)
 */

const updatePatientDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, address, emergencyContact } =
      req.body;

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role !== 'doctor' && req.user.id !== id) {
      return res.status(403).json({
        error: "Unathorized to update this profile because you don't own it"
      });
    }

    if (firstName) patient.firstName = firstName;
    if (lastName) patient.lastName = lastName;
    if (phoneNumber) patient.phoneNumber = phoneNumber;
    if (address) patient.address = address;
    if (emergencyContact) patient.emergencyContact = emergencyContact;

    await patient.save();

    return res.status(200).json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid patient ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update a patients password
 * @route:  POST /api/version/patients/patientID/password
 * @body:  { currentPassword, newPasword }
 * @access: Private (Only the actual Patient)
 */

const updatePatientPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: 'Current password and new password are required' });
    }

    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ error: 'Only the account owner can update their password' });
    }

    const patient = await Patient.findById(id).lean();

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      patient.passwordHash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await Patient.findByIdAndUpdate(id, { passwordHash, updatedPassword: true });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Soft delete a patient
 * @route: DELETE /api/version/patients/patientID
 * @access: Private (Doctor &  Acutal Patient
 * Admin is yet to be implemented)
 *
 */

const deletePatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role !== 'doctor' && req.user.id !== id) {
      return res.status(403).json({
        error: "Unathorized to delete this profile because you don't own it"
      });
    }

    patient.isActive = false;
    await patient.save();

    return res
      .status(200)
      .json({ message: 'Patient deactivated successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid patient ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Assign a doctor to a patient
 * @route: POST /api/version/patients/patientID/doctors
 * @body: { doctorId }
 * @access: Private (Doctors only)
 */

const assignDoctorToPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }

    const patient = await Patient.findById(id);
    const doctor = await Doctor.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (patient.assignedDoctors.includes(doctorId)) {
      return res
        .status(409)
        .json({ error: 'Doctor is already assigned to this patient' });
    }

    patient.assignedDoctors.push(doctorId);
    doctor.assignedPatients.push(patient.id);

    await patient.save();
    await doctor.save();

    return res.status(200).json({
      message: 'Doctor assigned to patient successfully',
      patient
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Remove doctor from patient
 * @route: DELETE /api/version/patients/patientID/doctors/doctorID
 * @access: Private (Doctor only)
 */

const removeDoctorFromPatient = async (req, res) => {
  try {
    const { id, doctorId } = req.params;

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.assignedDoctors.includes(doctorId)) {
      return res
        .status(404)
        .json({ error: 'Doctor is not assigned to this patient' });
    }

    patient.assignedDoctors = patient.assignedDoctors.filter(
      (doctor) => doctor.toString() !== doctorId
    );

    await patient.save();

    return res.status(200).json({
      message: 'Doctor removed from patient successfully',
      patient
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerNewPatient,
  getAllPatients,
  getPatientById,
  updatePatientDetails,
  updatePatientPassword,
  deletePatientById,
  assignDoctorToPatient,
  removeDoctorFromPatient
};
