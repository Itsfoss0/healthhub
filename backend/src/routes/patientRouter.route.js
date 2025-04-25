const authMiddleware = require('../middleware/authMiddleware.middleware');
const patientController = require('../controllers/patientController.controler');

const patientRouter = require('express').Router();

patientRouter.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  patientController.getAllPatients
);

patientRouter.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['doctor', 'patient']),
  patientController.getPatientById
);

patientRouter.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['doctor', 'patient']),
  patientController.updatePatientDetails
);

patientRouter.post(
  '/:id/password',
  authMiddleware.authenticate,
  authMiddleware.authorize('patient'),
  patientController.updatePatientPassword
);

patientRouter.post(
  '/:id/doctors',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  patientController.assignDoctorToPatient
);

patientRouter.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  patientController.registerNewPatient
);

patientRouter.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['doctor', 'patient']),
  patientController.deletePatientById
);

patientRouter.delete(
  '/:id/doctors/:doctorId',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  patientController.removeDoctorFromPatient
);

module.exports = patientRouter;
