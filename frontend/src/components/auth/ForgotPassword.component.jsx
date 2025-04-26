import { useState } from 'react';
import { ArrowRight, Mail, User, UserCog, ArrowLeft } from 'lucide-react';
import authService from '../../services/auth.service';

export default function ForgotPasswordComponent () {
  const [userType, setUserType] = useState('doctor');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        email,
        accountType: userType
      };

      const resp = await authService.forgotPassword(payload);

      if (resp.status === 200) {
        setSuccess(true);
        setIsSubmitted(true);
      } else if (resp.status === 404) {
        setError('No account found with this email address');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(
        'Failed to send reset link. Please check your network connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='w-full flex flex-col justify-center items-center py-4 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md'>
          {!isSubmitted ? (
            <>
              <div className='text-center'>
                <div className='flex justify-center'>
                  {userType === 'doctor'
                    ? (
                      <UserCog className='h-8 w-8 text-indigo-600' />
                      )
                    : (
                      <User className='h-8 w-8 text-indigo-600' />
                      )}
                </div>
                <h2 className='mt-4 text-3xl font-bold text-gray-900'>
                  Forgot Password
                </h2>
                <p className='mt-2 text-sm text-gray-600'>
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className='rounded-md bg-red-50 p-4 border border-red-200'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='h-5 w-5 text-red-500'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-red-800'>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className='flex justify-center mt-6'>
                <div className='bg-gray-100 p-1 rounded-lg inline-flex'>
                  <button
                    type='button'
                    className={`px-4 py-2 rounded-md ${
                      userType === 'doctor'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    } transition-all`}
                    onClick={() => setUserType('doctor')}
                  >
                    Doctor
                  </button>
                  <button
                    type='button'
                    className={`px-4 py-2 rounded-md ${
                      userType === 'patient'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    } transition-all`}
                    onClick={() => setUserType('patient')}
                  >
                    Patient
                  </button>
                </div>
              </div>

              <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email address
                  </label>
                  <div className='mt-1 relative'>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className='appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='you@example.com'
                    />
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Mail className='h-5 w-5 text-gray-400' />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className='flex items-center'>
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                      {!isLoading && <ArrowRight className='ml-2 h-5 w-5' />}
                    </span>
                  </button>
                </div>
              </form>

              <div className='text-center mt-4'>
                <a
                  href='/auth/login'
                  className='inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to login
                </a>
              </div>
            </>
          ) : (
            <div className='text-center py-6'>
              <div
                className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  success ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <Mail
                  className={`h-6 w-6 ${
                    success ? 'text-green-600' : 'text-red-600'
                  }`}
                />
              </div>
              <h3 className='mt-3 text-lg font-medium text-gray-900'>
                {success ? 'Check your email' : 'Error sending email'}
              </h3>
              <p className='mt-2 text-sm text-gray-500'>
                {success
                  ? (
                    <>
                      We've sent a password reset link to {' '}
                      <span className='font-medium'> your email</span>
                    </>
                    )
                  : (
                      'Failed to send reset link. Please try again.'
                    )}
              </p>
              <div className='mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setIsSubmitted(false);
                    setError(null);
                  }}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    success
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    success ? 'focus:ring-indigo-500' : 'focus:ring-red-500'
                  }`}
                >
                  {success ? 'Send another reset link' : 'Try Again'}
                </button>
              </div>
              <div className='mt-4'>
                <a
                  href='/auth/login'
                  className='inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to login
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
