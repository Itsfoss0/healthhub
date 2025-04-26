const Program = require('../models/Program.model');
const Patient = require('../models/Patient.model');
const { emailData } = require('../utils/emails.util');
const sendEmail = require('../services/sendEmail.service');
const { CLIENT_URL } = require('../config/env.config');

/**
 * Add a new program
 * @route: POST /api/version/programs
 * @body: { name, description, type, capacity, startDate}
 * @access: Private (Doctor only)
 * @auth: Bearer Token
 */

const createProgram = async (req, res) => {
  try {
    const { name, description, type, capacity, startDate, endDate } = req.body;

    if (!name || !description || !type || !startDate) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (req.user.role !== 'doctor') {
      return res
        .status(403)
        .json({ error: 'Only doctors can create programs' });
    }
    const program = new Program({
      name,
      description,
      type,
      capacity: capacity || null,
      startDate,
      endDate: endDate || null,
      coordinator: req.user.id
    });

    await program.save();

    return res.status(201).json({
      message: 'Program created successfully',
      program
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * List all available programs
 * @route: GET /api/version/programs
 * @access: Private (Doctor Only)
 * @params: ?isActive=true&type=sometype&hasCapacity=20
 * @auth: Bearer Token
 *
 */

const getAllPrograms = async (req, res) => {
  try {
    const { isActive, type, coordinatorId, hasCapacity } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (type) {
      filter.type = type;
    }

    if (coordinatorId) {
      filter.coordinator = coordinatorId;
    }

    if (hasCapacity === 'true') {
      filter.$or = [
        { capacity: null },
        { $expr: { $gt: ['$capacity', { $size: '$participants' }] } }
      ];
    }

    let query = Program.find(filter);

    if (req.query.cordinator === 'true') {
      query = query.populate('coordinator', 'firstName lastName email');
    }

    if (req.query.participants === 'true') {
      query = query.populate('participants.patient', 'firstName lastName');
    }

    const programs = await query.exec();

    return res.status(200).json({ programs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * List the details of a program with ID
 * @route: GET /api/version/programs/programID
 * @params: ?cordinator=true&participants=true
 * @access: Private (Doctor only)
 * @auth: Bearer Token
 */

const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const { cordinator, participants } = req.query;

    let query = Program.findById(id);

    if (cordinator === 'true') {
      query = query.populate('coordinator', 'firstName lastName email');
    }

    if (participants === 'true') {
      query = query.populate('participants.patient', 'firstName lastName');
    }

    const program = await query.exec();

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    return res.status(200).json({ program });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid program ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update program details with ID
 * @route: PUT /api/version/programs/programID
 * @body: {name, description, type, capacity, isActive, startDate, endDate}
 * @access: Private (Doctor only)
 * @auth: Bearer Token
 *
 */

const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, capacity, startDate, endDate, isActive } =
      req.body;

    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    if (program.coordinator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Cannot update this program because you don't own it" });
    }
    if (name) program.name = name;
    if (description) program.description = description;
    if (type) program.type = type;
    if (capacity !== undefined) program.capacity = capacity;
    if (startDate) program.startDate = startDate;
    if (endDate !== undefined) program.endDate = endDate;
    if (isActive !== undefined) program.isActive = isActive;

    await program.save();

    return res.status(200).json({
      message: 'Program updated successfully',
      program
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid program ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete a program
 * @route: DELETE /api/version/programs/programID
 * @access: Private(The Creator)
 * @auth: Bearer Token
 * only a doctor should be able to delete
 * a program or change any of the properites
 * also, the doctor who created the program is the
 * only one that can make changes to it.
 */

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    if (program.coordinator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Cannot delete this program because you don't own it" });
    }

    program.isActive = false;
    await program.save();

    return res
      .status(200)
      .json({ message: 'Program deactivated successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid program ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Add patients to a program
 * @route: POST /api/version/programs/programID/participants
 * @body: { patientId}
 * @access: Private(Doctor only)
 * @auth: Bearer Token
 *
 */

const addPatientToProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient || !patient.isActive) {
      return res.status(404).json({ error: 'Patient not found or inactive' });
    }

    const program = await Program.findById(id)
      .populate('coordinator', 'firstName')
      .exec();

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    if (!program.isActive) {
      return res
        .status(400)
        .json({ error: 'Cannot add patients to an inactive program' });
    }

    if (
      program.capacity !== null &&
      program.participants.length >= program.capacity
    ) {
      return res
        .status(400)
        .json({ error: 'Program has reached maximum capacity' });
    }

    if (
      program.participants.some(
        (p) => p.patient.toString() === patientId && p.status === 'active'
      )
    ) {
      return res
        .status(409)
        .json({ error: 'Patient is already active in this program' });
    }

    program.participants.push({
      patient: patientId,
      admissionDate: new Date(),
      status: 'active'
    });

    await program.save();

    await Patient.findByIdAndUpdate(patientId, {
      $push: {
        programHistory: {
          program: id,
          admissionDate: new Date(),
          status: 'active'
        }
      }
    });

    const data = {
      ...emailData,
      email: patient.email,
      doctorName: program.coordinator.firstName,
      patientName: patient.firstName,
      startDate: program.startDate,
      programName: program.name,
      programDescription: program.description,
      patientPortalLink: `${CLIENT_URL}/auth/login`
    };

    await sendEmail(
      patient.email,
      'You have been added to a health program',
      'patientAdded',
      data
    );

    return res.status(200).json({
      message: 'Patient added to program successfully',
      program
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
 * Update Participants details
 * Or add Notes about a participants progress
 * @route: PUT /api/version/programs/programID/participants/patientID
 * @body: { status, notes }
 * @access: Private (Doctor only)
 * @auth: Bearer Token
 */

const updateParticipantStatus = async (req, res) => {
  try {
    const { id, patientId } = req.params;
    const { status, dischargeDate, notes } = req.body;

    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const participantIndex = program.participants.findIndex(
      (p) => p.patient.toString() === patientId && p.status !== 'completed'
    );

    if (participantIndex === -1) {
      return res
        .status(404)
        .json({ error: 'Active participant not found in program' });
    }

    if (status) {
      program.participants[participantIndex].status = status;
    }

    if (notes !== undefined) {
      program.participants[participantIndex].notes = notes;
    }

    if (dischargeDate) {
      program.participants[participantIndex].dischargeDate = new Date(
        dischargeDate
      );
    } else if (status === 'completed' || status === 'withdrawn') {
      program.participants[participantIndex].dischargeDate = new Date();
    }

    await program.save();

    const patient = await Patient.findById(patientId);
    if (patient) {
      const programIndex = patient.programHistory.findIndex(
        (p) => p.program.toString() === id && !p.dischargeDate
      );

      if (programIndex !== -1) {
        if (status) {
          patient.programHistory[programIndex].status =
            status === 'on-hold' ? 'pending' : status;
        }

        if (dischargeDate || status === 'completed' || status === 'withdrawn') {
          patient.programHistory[programIndex].dischargeDate = dischargeDate
            ? new Date(dischargeDate)
            : new Date();
        }

        await patient.save();
      }
    }

    return res.status(200).json({
      message: 'Participant status updated successfully',
      program
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
 * Remove patient from Program
 * @route: DELETE /api/version/programs/programID/participants/patientID
 * @params: ?forceRemove=true
 * @access: Private (Doctor only)
 * @auth: Bearer Token
 */

const removeParticipantFromProgram = async (req, res) => {
  try {
    const { id, patientId } = req.params;
    const { forceRemove } = req.query;

    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const participantIndex = program.participants.findIndex(
      (p) => p.patient.toString() === patientId
    );

    if (participantIndex === -1) {
      return res
        .status(404)
        .json({ error: 'Participant not found in program' });
    }

    if (forceRemove === 'true') {
      program.participants.splice(participantIndex, 1);
    } else {
      program.participants[participantIndex].status = 'withdrawn';
      program.participants[participantIndex].dischargeDate = new Date();

      await Patient.updateOne(
        {
          _id: patientId,
          'programHistory.program': id,
          'programHistory.dischargeDate': null
        },
        {
          $set: {
            'programHistory.$.status': 'withdrawn',
            'programHistory.$.dischargeDate': new Date()
          }
        }
      );
    }

    await program.save();

    return res.status(200).json({
      message:
        forceRemove === 'true'
          ? 'Participant removed from program'
          : 'Participant withdrawn from program',
      program
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
 * Get statistics about a program
 * @route: GET /api/version/programs/programID/stats
 * @access: Private (Doctor only)
 * @auth: Bearer Token
 *
 */
const getProgramStats = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const totalParticipants = program.participants.length;
    const activeParticipants = program.participants.filter(
      (p) => p.status === 'active'
    ).length;
    const completedParticipants = program.participants.filter(
      (p) => p.status === 'completed'
    ).length;
    const withdrawnParticipants = program.participants.filter(
      (p) => p.status === 'withdrawn'
    ).length;
    const onHoldParticipants = program.participants.filter(
      (p) => p.status === 'on-hold'
    ).length;

    const capacityPercentage = program.capacity
      ? Math.round((activeParticipants / program.capacity) * 100)
      : null;

    const spotsAvailable = program.capacity
      ? program.capacity - activeParticipants
      : null;

    let averageDurationDays = 0;
    const completedWithDates = program.participants.filter(
      (p) => p.status === 'completed' && p.admissionDate && p.dischargeDate
    );

    if (completedWithDates.length > 0) {
      const totalDurationDays = completedWithDates.reduce((total, p) => {
        const admissionDate = new Date(p.admissionDate);
        const dischargeDate = new Date(p.dischargeDate);
        const durationMs = dischargeDate - admissionDate;
        const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
        return total + durationDays;
      }, 0);

      averageDurationDays = Math.round(
        totalDurationDays / completedWithDates.length
      );
    }

    return res.status(200).json({
      stats: {
        totalParticipants,
        activeParticipants,
        completedParticipants,
        withdrawnParticipants,
        onHoldParticipants,
        capacityPercentage,
        spotsAvailable,
        averageDurationDays,
        isActive: program.isActive,
        hasEnded: program.endDate && new Date(program.endDate) < new Date()
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid program ID format' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  addPatientToProgram,
  updateParticipantStatus,
  removeParticipantFromProgram,
  getProgramStats
};
