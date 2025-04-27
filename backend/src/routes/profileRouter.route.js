const authMiddleware = require('../middleware/authMiddleware.middleware');
const profileController = require('../controllers/profileController.controller');

const profileRouter = require('express').Router();

profileRouter.get(
  '',
  authMiddleware.authenticate,
  authMiddleware.authorize(['doctor', 'patient']),
  profileController
);

module.exports = profileRouter;
