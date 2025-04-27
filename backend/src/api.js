const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger.middleware');
const connectDBInstance = require('./db/connection.db');
const { MONGO_URI } = require('./config/env.config');
const probesRouter = require('./routes/probesRouter.route');
const doctorRouter = require('./routes/doctorRouter.route');
const authRouter = require('./routes/authRouter.route');
const programRouter = require('./routes/programRouter.route');
const patientRouter = require('./routes/patientRouter.route');
const profileRouter = require('./routes/profileRouter.route');

connectDBInstance(MONGO_URI);

const api = express();

api.use(logger);
api.use(cookieParser());
api.use(express.json());
api.use(cors());

api.use('/api/v1/status', probesRouter);
api.use('/api/v1/doctors', doctorRouter);
api.use('/api/v1/programs', programRouter);
api.use('/api/v1/patients', patientRouter);
api.use('/api/v1/auth', authRouter);
api.use('/api/v1/profile', profileRouter)

module.exports = api;
