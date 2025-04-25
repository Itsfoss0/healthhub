const doctorController = require('../controllers/doctorController.controller');
const authMiddleware = require('../middleware/authMiddleware.middleware');
const doctorRouter = require('express').Router();

doctorRouter.post('/', doctorController.registerNewDoctor);

doctorRouter.get(
  '/',
  authMiddleware.authenticate,
  doctorController.getAllDoctors
);

doctorRouter.get(
  '/:id',
  authMiddleware.authenticate,
  doctorController.getDoctorById
);

doctorRouter.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  doctorController.updateDoctorDetails
);

doctorRouter.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize('doctor'),
  doctorController.deleteDoctorById
);

module.exports = doctorRouter;
