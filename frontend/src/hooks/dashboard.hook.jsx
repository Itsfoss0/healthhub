import { useState, useEffect } from 'react';
import useAuth from './authHook.hook';
import patientService from '../services/patientService.service';
import programService from '../services/programService.service';
import { mockEnrollments } from '../lib/mockData';

export default function useDashboardDetails () {
  const { getUser } = useAuth();
  const user = getUser();
  const auth = user.accessToken;

  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePrograms: 0,
    completedPrograms: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let totalPatients = 0;
        let activePrograms = 0;
        const completedPrograms = 0;

        const patientsResp = await patientService.getAllPatients(auth);
        if (patientsResp.status === 200) {
          const allPatients = patientsResp.data.patients;
          setPatients(allPatients);
          totalPatients = allPatients.length;
        }
        const programsResp = await programService.getAllPrograms(auth);
        if (programsResp.status === 200) {
          const allPrograms = programsResp.data.programs;
          setPrograms(allPrograms);
          activePrograms = allPrograms.filter((p) => p.isActive).length;
        }
        setStats({ totalPatients, activePrograms, completedPrograms });
        setDoctor(user.user);
        setEnrollments(mockEnrollments);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('An error occured when loading your profile');
        console.error('Failed to fetch dashboard details:', error);
      }
    };

    fetchData();
  }, [auth]);

  return {
    doctor,
    patients,
    programs,
    enrollments,
    setEnrollments,
    error,
    loading,
    stats
  };
}
