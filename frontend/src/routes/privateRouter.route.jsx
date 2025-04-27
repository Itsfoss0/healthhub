import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/authHook.hook';

export default function LoginRequired ({ children }) {
  const { getUser } = useAuth();
  const user = getUser();

  return user ? children : <Navigate to='/auth/login' />;
}
