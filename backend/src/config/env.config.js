/**
 * Configure environment variables and other
 * sentitive credentials & secrets to
 * be managed in a centralized place
 */

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const REFRESH_TOKEN_VALID_FOR = process.env.REFRESH_TOKEN_VALID_FOR;
const ACESS_TOKEN_VALID_FOR = process.env.ACESS_TOKEN_VALID_FOR;

module.exports = {
  MONGO_URI,
  JWT_SECRET,
  PORT,
  BREVO_API_KEY,
  CLIENT_URL,
  REFRESH_TOKEN_VALID_FOR,
  ACESS_TOKEN_VALID_FOR
};
