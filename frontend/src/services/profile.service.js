import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api/v1/profile';

async function getUserProfile (auth) {
  try {
    const resp = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${auth}`
      }
    });
    return resp;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

export default {
  getUserProfile
};
