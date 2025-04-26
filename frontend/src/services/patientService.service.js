import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/patients';

async function addPatient (patientDetails, auth) {
  try {
    const resp = await axios.post(BASE_URL, patientDetails, {
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

async function getAllPatients (auth) {
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

async function getPatientById (patientId, auth) {
  try {
    const resp = await axios.get(`${BASE_URL}/${patientId}`, {
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

async function updatePatientDetails (patientId, details, auth) {
  try {
    const resp = await axios.put(`${BASE_URL}/${patientId}`, details, {
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

async function updatePatientPassword (patientId, password, auth) {
  try {
    const resp = await axios.post(
      `${BASE_URL}/${patientId}/password`,
      password,
      {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return resp;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

async function deletePatient (patientId, auth) {
  try {
    const resp = await axios.delete(`${BASE_URL}/${patientId}`, {
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

async function assignDoctor (patientId, doctorId, auth) {
  try {
    const resp = await axios.post(
      `${BASE_URL}/${patientId}/doctors`,
      doctorId,
      {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return resp;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

export default {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatientDetails,
  updatePatientPassword,
  deletePatient,
  assignDoctor
};
