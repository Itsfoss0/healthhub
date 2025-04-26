import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';

const VerificationStatus = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyAccount = async () => {
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      try {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
          setStatus('error');
          setMessage('Verification token is missing');
          return;
        }

        const response = await authService.verifyUser(token, id);
        setStatus(response.data.status);
        setMessage(response.data.message);
        setUserName(response.data.name);
        console.log(response);
      } catch (error) {
        console.log(error);
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
            'An error occurred during verification'
        );
      }
    };

    verifyAccount();
  }, [id, location.search]);

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  if (status === 'loading') {
    return (
      <div className='font-sans bg-gray-50 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4' />
          <p className='text-gray-600'>Verifying your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='font-sans bg-gray-50 min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
        {status === 'success'
          ? (
            <>
              <h1 className='text-2xl font-bold text-green-600 mb-4'>
                Account Verified!
              </h1>
              <p className='text-gray-600 mb-6'>
                Congratulations, {userName}! Your account has been successfully
                verified. You can now log in and start using our platform.
              </p>
              <button
                onClick={handleLogin}
                className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'
              >
                Log In
              </button>
            </>
            )
          : (
            <>
              <h1 className='text-2xl font-bold text-red-600 mb-4'>
                Could not verify your account
              </h1>
              <p className='text-gray-600 mb-4'>{message}</p>
              <p className='text-gray-600 mb-4'>Please try the following:</p>
              <ul className='list-disc list-inside text-gray-600 mb-6'>
                <li>Check if you've already verified your account</li>
                <li>
                  Try copying and pasting the entire URL from your email into your
                  browser
                </li>
                <li>Request a new verification email if your link has expired</li>
              </ul>
              <button
                onClick={handleContactSupport}
                className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'
              >
                Contact Support
              </button>
            </>
            )}
      </div>
    </div>
  );
};

export default VerificationStatus;
