import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api/v1/doctors';

async function registerNewDoctor (details) {
  try {
    const resp = await axios.post(BASE_URL, details);
    return resp;
  } catch (error) {
    return error.response;
  }
}

async function getAllDoctors (auth) {
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

async function getDoctorById (doctorId, auth) {
  try {
    const resp = await axios.get(`${BASE_URL}/${doctorId}`, {
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

async function updateDoctorDetails (doctorId, details, auth) {
  try {
    const resp = await axios.put(`${BASE_URL}/${doctorId}`, details, {
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    return resp;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

async function deleteDoctorAccount (doctorId, auth) {
  try {
    const resp = await axios.delete(`${BASE_URL}/${doctorId}`, {
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
  registerNewDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorDetails,
  deleteDoctorAccount
};
