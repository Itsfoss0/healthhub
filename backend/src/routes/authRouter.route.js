const authController = require('../controllers/authController.controller');

const authRouter = require('express').Router();

authRouter.get('/verify/:id', authController.verifyAccount);
authRouter.get('/password/:id/', authController.allowUpdatePassword);
authRouter.post('/password/:id/reset', authController.updatePassword);
authRouter.post('/password/forgot', authController.resetPassword);
authRouter.post('/login', authController.loginToAccount);
authRouter.post('/token/refresh', authController.refreshToken);

module.exports = authRouter;
