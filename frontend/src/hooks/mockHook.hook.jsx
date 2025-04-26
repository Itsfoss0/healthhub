import { useState, useEffect } from 'react';
import { mockPatients, mockDoctor, mockPrograms, mockEnrollments } from '../lib/mockData';

export function useMockData () {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePrograms: 0,
    completedPrograms: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setDoctor(mockDoctor);
        setPatients(mockPatients);
        setPrograms(mockPrograms);
        setEnrollments(mockEnrollments);
        const totalPatients = mockPatients.length;
        const activePrograms = mockPrograms.filter(
          (p) => p.status === 'active'
        ).length;
        const completedPrograms = mockPrograms.filter(
          (p) => p.status === 'completed'
        ).length;

        setStats({
          totalPatients,
          activePrograms,
          completedPrograms,
          upcomingAppointments: 5
        });

        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('An error occurred while loading mock data');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { doctor, patients, programs, enrollments, setEnrollments, stats, loading, error };
}
