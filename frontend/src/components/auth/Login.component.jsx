import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, User, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import useAuth from '../../hooks/authHook.hook';
import { useToastContext } from '../../context/ToastContext.component';

export default function LoginComponent () {
  const { toast } = useToastContext();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAs, setLoginAs] = useState('doctor');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      loginAs
    };

    try {
      const resp = await authService.loginUser(payload);

      if (resp.status === 200) {
        toast({
          tittle: 'Authenticated',
          description: 'Logged in Successfully',
          variant: 'success'
        });
        if (loginAs === 'doctor') {
          login(resp.data);
          return navigate('/dashboard');
        }
        return navigate('/patient');
      } else if (resp.status === 404) {
        setError('The email you provided does not exist');
        toast({
          title: 'User not found',
          description: 'The email you provided does not exist',
          variant: 'error'
        });
      } else if (resp.status === 401) {
        toast({
          title: 'Incorrect Password',
          description: 'The password you provided does not match',
          variant: 'error'
        });
        setError('The password you provided is incorrect');
      } else {
        setError('An unexpected error occurred. Please try again.');
        toast({
          title: 'Server Error',
          description: 'Your request could not be completeds',
          variant: 'error'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md'>
          <div className='text-center'>
            <div className='flex justify-center'>
              {loginAs === 'doctor'
                ? (
                  <UserCog className='h-8 w-8 text-indigo-600' />
                  )
                : (
                  <User className='h-8 w-8 text-indigo-600' />
                  )}
            </div>
            <h2 className='mt-4 text-3xl font-bold text-gray-900'>
              Welcome back
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Sign in to your HealthHub account
            </p>
          </div>

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
                  <p className='text-sm font-medium text-red-800'>{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className='flex justify-center mt-6'>
            <div className='bg-gray-100 p-1 rounded-lg inline-flex'>
              <button
                type='button'
                className={`px-4 py-2 rounded-md ${
                  loginAs === 'doctor'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-all`}
                onClick={() => setLoginAs('doctor')}
              >
                Doctor
              </button>
              <button
                type='button'
                className={`px-4 py-2 rounded-md ${
                  loginAs === 'patient'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-all`}
                onClick={() => setLoginAs('patient')}
              >
                Patient
              </button>
            </div>
          </div>

          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    placeholder='you@example.com'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1 relative'>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    placeholder='••••••••'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                        )
                      : (
                        <Eye className='h-5 w-5 text-gray-400' />
                        )}
                  </button>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='rememberMe'
                  type='checkbox'
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a
                  href='/auth/forgot'
                  className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <span className='flex items-center'>
                  {isSubmitting
                    ? (
                        'Signing in...'
                      )
                    : (
                      <>
                        Sign in <ArrowRight className='ml-2 h-5 w-5' />
                      </>
                      )}
                </span>
              </button>
            </div>
          </form>

          <div className='text-center mt-4'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <a
                href='/auth/signup'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
