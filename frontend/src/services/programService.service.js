import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api/v1/programs';

async function getAllPrograms (auth) {
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

async function getProgramById (programId, auth) {
  try {
    const resp = await axios.get(`${BASE_URL}/${programId}`, {
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

async function addNewProgram (programDetails, auth) {
  try {
    const resp = await axios.post(BASE_URL, programDetails, {
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

async function updateProgramDetails (programId, programDetails, auth) {
  try {
    const resp = await axios.put(`${BASE_URL}/${programId}`, programDetails, {
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

async function deleteProgram (programId, auth) {
  try {
    const resp = await axios.delete(`${BASE_URL}/${programId}`, {
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

async function addPatientToProgram (programId, patientId, auth) {
  try {
    const resp = await axios.post(
      `${BASE_URL}/${programId}/participant`,
      patientId,
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

async function updatePatientStatus (programId, patientId, data, auth) {
  try {
    const resp = await axios.put(
      `${BASE_URL}/${programId}/participants/${patientId}`,
      data,
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

async function removePatientFromProgram (programId, patientId, auth) {
  try {
    const resp = await axios.delete(
      `${BASE_URL}/${programId}/participants/${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      }
    );
    return resp;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

async function getProgramStats (programId, auth) {
  try {
    const resp = await axios.get(`${BASE_URL}/${programId}/stats`, {
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
  getAllPrograms,
  getProgramById,
  addNewProgram,
  updateProgramDetails,
  deleteProgram,
  addPatientToProgram,
  updatePatientStatus,
  removePatientFromProgram,
  getProgramStats
};
