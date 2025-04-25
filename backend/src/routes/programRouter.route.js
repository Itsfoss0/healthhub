const authMiddleware = require('../middleware/authMiddleware.middleware');
const programController = require('../controllers/programController.controller');

const programRouter = require('express').Router();

programRouter.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.getAllPrograms
);

programRouter.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['doctor', 'patient']),
  programController.getProgramById
);

programRouter.get(
  '/:id/stats',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.getProgramStats
);

programRouter.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.createProgram
);

programRouter.post(
  '/:id/participants',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.addPatientToProgram
);

programRouter.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.updateProgram
);

programRouter.put(
  '/:id/participants/:patientId',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.updateParticipantStatus
);

programRouter.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.deleteProgram
);

programRouter.delete(
  '/:id/participants/:patientId',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  programController.removeParticipantFromProgram
);

module.exports = programRouter;
