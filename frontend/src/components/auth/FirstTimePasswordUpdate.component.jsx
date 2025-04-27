import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, ShieldCheck, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/authHook.hook';
import { useToastContext } from '../../context/ToastContext.component';
import patientService from '../../services/patientService.service';

export default function FirstTimePasswordUpdate () {
  const { toast } = useToastContext();
  const { getUser, login } = useAuth();
  const auth = getUser();
  const user = auth.user;
  console.log(user);
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const passwordRequirements = [
    {
      id: 'length',
      text: 'At least 8 characters',
      valid: formData.newPassword.length >= 8
    },
    {
      id: 'uppercase',
      text: 'At least one uppercase letter',
      valid: /[A-Z]/.test(formData.newPassword)
    },
    {
      id: 'lowercase',
      text: 'At least one lowercase letter',
      valid: /[a-z]/.test(formData.newPassword)
    },
    {
      id: 'number',
      text: 'At least one number',
      valid: /[0-9]/.test(formData.newPassword)
    },
    {
      id: 'match',
      text: 'Passwords match',
      valid:
        formData.newPassword &&
        formData.newPassword === formData.confirmPassword
    }
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.valid);
  const canSubmit =
    formData.currentPassword && isPasswordValid && !isSubmitting;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const resp = await patientService.updatePatientPassword(
        user.user.id,
        formData,
        user.accessToken
      );

      if (resp.status === 200) {
        login({ ...auth, user: { ...user, updatedPassword: true } });
        navigate('/patient');
        toast({
          title: 'Password Updated',
          description: 'Your password has been successfully updated',
          variant: 'success'
        });
      } else if (resp.status === 401) {
        setError('The current password you provided is incorrect');
        toast({
          title: 'Incorrect Password',
          description: 'The current password you provided is incorrect',
          variant: 'error'
        });
      } else {
        setError('An unexpected error occurred. Please try again.');
        toast({
          title: 'Server Error',
          description: 'Your request could not be completed',
          variant: 'error'
        });
      }
    } catch (err) {
      console.error('Password update error:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    login({ ...auth, user: { ...user, updatedPassword: true } });
    navigate('/patient');
    toast({
      title: 'Welcome to HealthHub',
      description:
        'You can update your password later in your profile settings',
      variant: 'info'
    });
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md'>
          <div className='text-center'>
            <div className='flex justify-center'>
              <ShieldCheck className='h-12 w-12 text-emerald-600' />
            </div>
            <h2 className='mt-4 text-2xl font-bold text-gray-900'>
              Welcome to HealthHub
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              For your security, we recommend updating your password
            </p>
          </div>

          {error && (
            <div className='rounded-md bg-red-50 p-4 border border-red-200'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <XCircle className='h-5 w-5 text-red-500' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-red-800'>{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='currentPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  Current Password
                </label>
                <div className='mt-1 relative'>
                  <input
                    id='currentPassword'
                    name='currentPassword'
                    type={showCurrentPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    required
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='Enter your current password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword
                      ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                        )
                      : (
                        <Eye className='h-5 w-5 text-gray-400' />
                        )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor='newPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  New Password
                </label>
                <div className='mt-1 relative'>
                  <input
                    id='newPassword'
                    name='newPassword'
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='Create a strong password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword
                      ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                        )
                      : (
                        <Eye className='h-5 w-5 text-gray-400' />
                        )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm New Password
                </label>
                <div className='mt-1 relative'>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='Confirm your new password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword
                      ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                        )
                      : (
                        <Eye className='h-5 w-5 text-gray-400' />
                        )}
                  </button>
                </div>
              </div>

              <div className='mt-4'>
                <h4 className='text-sm font-medium text-gray-700 mb-2'>
                  Password Requirements
                </h4>
                <ul className='space-y-1'>
                  {passwordRequirements.map((req) => (
                    <li key={req.id} className='flex items-center text-sm'>
                      <span
                        className={
                          req.valid ? 'text-emerald-500' : 'text-gray-400'
                        }
                      >
                        {req.valid
                          ? (
                            <ShieldCheck className='inline h-4 w-4 mr-2' />
                            )
                          : (
                            <span className='inline-block w-4 h-4 mr-2 rounded-full border border-gray-300' />
                            )}
                      </span>
                      <span
                        className={
                          req.valid ? 'text-gray-700' : 'text-gray-500'
                        }
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='flex flex-col space-y-3'>
              <button
                type='submit'
                disabled={!canSubmit}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-md ${
                  !canSubmit ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <span className='flex items-center'>
                  {isSubmitting
                    ? (
                        'Updating password...'
                      )
                    : (
                      <>
                        Update Password <ArrowRight className='ml-2 h-5 w-5' />
                      </>
                      )}
                </span>
              </button>

              <button
                type='button'
                onClick={handleSkip}
                className='text-sm text-gray-600 hover:text-gray-800 font-medium py-2'
              >
                Skip for now
              </button>
            </div>
          </form>

          <div className='text-center pt-4 text-xs text-gray-500'>
            You can update your password later in your profile settings
          </div>
        </div>
      </div>
    </div>
  );
}
