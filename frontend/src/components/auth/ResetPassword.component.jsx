import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service.js';

const PasswordReset = () => {
  const [status, setStatus] = useState('input');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    match: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resetAttempted = useRef(false);

  const minLength = 8;
  const upperCasePattern = /[A-Z]/;
  const numberPattern = /[0-9]/;
  const specialCharPattern = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  useEffect(() => {
    const verifyResetToken = async () => {
      if (resetAttempted.current) return;
      resetAttempted.current = true;

      try {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
          setStatus('error');
          setMessage('Password reset token is missing');
          return;
        }

        const response = await authService.verifyResetToken(token, id);
        if (response.status === 200) {
          setUserName(response.data.firstName);
          setStatus('input');
        } else {
          setStatus('error');
          setMessage(response.data.error || 'Invalid or expired reset link');
        }
      } catch (error) {
        console.log(error);
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
            'An error occurred while verifying your reset link'
        );
      }
    };

    verifyResetToken();
  }, [id, location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const { password, confirmPassword } = formData;

    setPasswordErrors({
      length: password.length < minLength,
      match: confirmPassword && password !== confirmPassword,
      hasUpperCase: !upperCasePattern.test(password),
      hasNumber: !numberPattern.test(password),
      hasSpecialChar: !specialCharPattern.test(password)
    });
    // Calculate password strength (0-100)
    let strength = 0;
    if (password.length >= minLength) strength += 25;
    if (upperCasePattern.test(password)) strength += 25;
    if (numberPattern.test(password)) strength += 25;
    if (specialCharPattern.test(password)) strength += 25;

    setPasswordStrength(strength);
  }, [formData, numberPattern, specialCharPattern, upperCasePattern]);

  const validatePassword = () => {
    const { password, confirmPassword } = formData;

    // Check basic validations
    if (password.length < minLength) {
      setPasswordErrors((prev) => ({ ...prev, length: true }));
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordErrors((prev) => ({ ...prev, match: true }));
      return false;
    }

    // Check additional criteria
    if (!upperCasePattern.test(password)) {
      setPasswordErrors((prev) => ({ ...prev, hasUpperCase: true }));
      return false;
    }

    if (!numberPattern.test(password)) {
      setPasswordErrors((prev) => ({ ...prev, hasNumber: true }));
      return false;
    }

    if (!specialCharPattern.test(password)) {
      setPasswordErrors((prev) => ({ ...prev, hasSpecialChar: true }));
      return false;
    }

    return true;
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setStatus('loading');

    try {
      const token = new URLSearchParams(location.search).get('token');
      const response = await authService.resetPassword(token, id, {
        password: formData.password
      });

      setStatus('success');
      setMessage(
        response.data.message || 'Password has been successfully reset'
      );
    } catch (error) {
      console.log(error);
      setStatus('error');
      setMessage(
        error.response?.data?.message ||
          'An error occurred while resetting your password'
      );
    }
  };

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  // Get the appropriate color for the strength bar
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get the appropriate text for the strength indicator
  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full p-6 bg-white rounded-lg shadow-lg'>
          <div className='text-center'>
            <div className='flex justify-center mb-4'>
              <svg
                className='animate-spin h-10 w-10 text-blue-500'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              Resetting your password...
            </h2>
            <p className='text-gray-600'>
              Please wait while we update your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100'>
        <div className='max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-100'>
          <div className='text-center mb-6'>
            <div className='flex justify-center mb-4'>
              <div className='rounded-full bg-green-100 p-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-green-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>
              Password Reset Successful!
            </h2>
            <p className='text-gray-600 mb-8'>
              {message ||
                'Your password has been successfully reset. You can now log in with your new password.'}
            </p>
            <button
              onClick={handleLogin}
              className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1'
            >
              Log In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-gray-100'>
        <div className='max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-100'>
          <div className='text-center mb-6'>
            <div className='flex justify-center mb-4'>
              <div className='rounded-full bg-red-100 p-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>
              Password Reset Failed
            </h2>
            <p className='text-red-600 mb-6 font-medium'>{message}</p>
            <div className='bg-gray-50 p-6 rounded-md text-left mb-6 border border-gray-200'>
              <p className='font-medium text-gray-800 mb-3 text-lg'>
                Please try the following:
              </p>
              <ul className='list-disc pl-5 text-gray-700 space-y-2'>
                <li>
                  Check if your reset link has expired (valid for 24 hours)
                </li>
                <li>
                  Try copying and pasting the entire URL from your email into
                  your browser
                </li>
                <li>Request a new password reset email</li>
              </ul>
            </div>
            <div className='space-y-3'>
              <button
                onClick={() => navigate('/auth/forgot-password')}
                className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 shadow-md'
              >
                Request New Reset Link
              </button>
              <button
                onClick={handleContactSupport}
                className='w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-200'
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4'>
      <div className='max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-100'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 mb-3 text-center'>
            Reset Your Password
          </h2>
          <p className='text-gray-600 mb-6 text-center'>
            Hello, <span className='font-semibold'>{userName}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label
                htmlFor='password'
                className='block text-left text-sm font-medium text-gray-700 mb-2'
              >
                New Password
              </label>
              <div className='relative'>
                <input
                  type={passwordVisible.password ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border ${
                    passwordErrors.length ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  required
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600'
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {passwordVisible.password
                    ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                        <path
                          fillRule='evenodd'
                          d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      )
                    : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                          clipRule='evenodd'
                        />
                        <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                      </svg>
                      )}
                </button>
              </div>

              {formData.password && (
                <div className='mt-4 mb-4'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-sm text-gray-600'>
                      Password Strength:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength <= 25
                          ? 'text-red-500'
                          : passwordStrength <= 50
                          ? 'text-orange-500'
                          : passwordStrength <= 75
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}

              <div className='mt-3 space-y-2'>
                <div
                  className={`flex items-center ${
                    passwordErrors.length ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    {formData.password.length >= minLength
                      ? (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                        )
                      : (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                        )}
                  </svg>
                  <span className='text-xs'>
                    At least {minLength} characters
                  </span>
                </div>
                <div
                  className={`flex items-center ${
                    passwordErrors.hasUpperCase
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    {upperCasePattern.test(formData.password)
                      ? (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                        )
                      : (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                        )}
                  </svg>
                  <span className='text-xs'>At least one uppercase letter</span>
                </div>
                <div
                  className={`flex items-center ${
                    passwordErrors.hasNumber ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    {numberPattern.test(formData.password)
                      ? (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                        )
                      : (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                        )}
                  </svg>
                  <span className='text-xs'>At least one number</span>
                </div>
                <div
                  className={`flex items-center ${
                    passwordErrors.hasSpecialChar
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    {specialCharPattern.test(formData.password)
                      ? (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                        )
                      : (
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                        )}
                  </svg>
                  <span className='text-xs'>
                    At least one special character
                  </span>
                </div>
              </div>
            </div>

            <div className='mb-8'>
              <label
                htmlFor='confirmPassword'
                className='block text-left text-sm font-medium text-gray-700 mb-2'
              >
                Confirm New Password
              </label>
              <div className='relative'>
                <input
                  type={passwordVisible.confirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border ${
                    passwordErrors.match && formData.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  required
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600'
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {passwordVisible.confirmPassword
                    ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                        <path
                          fillRule='evenodd'
                          d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      )
                    : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                          clipRule='evenodd'
                        />
                        <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                      </svg>
                      )}
                </button>
              </div>
              {passwordErrors.match && formData.confirmPassword && (
                <p className='mt-2 text-left text-sm text-red-600'>
                  Passwords do not match
                </p>
              )}
            </div>

            <div className='mb-4'>
              <button
                type='submit'
                className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 shadow-md transform hover:-translate-y-1 hover:shadow-lg 
                ${
                  !formData.password ||
                  !formData.confirmPassword ||
                  passwordErrors.length ||
                  passwordErrors.match
                    ? 'opacity-70 cursor-not-allowed'
                    : ''
                }`}
                disabled={
                  !formData.password ||
                  !formData.confirmPassword ||
                  passwordErrors.length ||
                  passwordErrors.match
                }
              >
                Reset Password
              </button>
            </div>
          </form>

          <div className='text-center mt-6'>
            <p className='text-sm text-gray-600'>
              Remember your password?{' '}
              <button
                onClick={handleLogin}
                className='text-blue-600 hover:text-blue-800 font-medium'
              >
                Log in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
