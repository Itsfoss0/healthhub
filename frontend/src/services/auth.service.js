import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api/v1/auth';

async function loginUser (userDetails) {
  try {
    const resp = await axios.post(`${BASE_URL}/login`, userDetails);
    return resp;
  } catch (error) {
    return error.response;
  }
}

async function forgotPassword (userDetails) {
  try {
    const resp = await axios.post(`${BASE_URL}/password/forgot`, userDetails);
    return resp;
  } catch (error) {
    return error.response;
  }
}

async function verifyResetToken (token, userId) {
  const res = await axios.get(`${BASE_URL}/password/${userId}?token=${token}`);
  return res;
}

async function refreshAccessToken () {
  try {
    const res = await axios.post(
      `${BASE_URL}/token/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );
    return res;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

async function verifyUser (token, userId) {
  const res = await axios.get(
    `${BASE_URL}/verify/${userId}?token=${token}`
  );
  return res;
}

export default {
  loginUser,
  forgotPassword,
  verifyResetToken,
  refreshAccessToken,
  verifyUser
};
