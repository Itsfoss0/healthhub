import { useEffect, useState } from 'react';
import useAuth from './authHook.hook';
import profileService from '../services/profile.service';

export default function usePatientProfile () {
  const { getUser } = useAuth();
  const user = getUser();
  const auth = user.accessToken;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const resp = await profileService.getUserProfile(auth);
      if (resp.status === 200) {
        setPatient(resp.data.user);
        setIsLoading(false);
      } else {
        setError(
          resp.data.error || 'An error occured when fetching patient profile'
        );
      }
    };

    fetchUserProfile();
  }, [auth]);

  return { patient, error, isLoading };
}
