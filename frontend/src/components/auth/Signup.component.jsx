/* eslint-disable no-unused-vars */

import { useState } from 'react';
import { ArrowRight, User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import doctorServicesService from '../../services/doctorServices.service';

export default function SignupPage () {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    agreeToTerms: false
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      setMessage({
        type: 'error',
        text: 'You must agree to the terms and conditions'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const resp = await doctorServicesService.registerNewDoctor(formData);

      if (resp.status === 201) {
        setMessage({
          type: 'success',
          text: 'Account created successfully! Please check your email to verify your account.'
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          agreeToTerms: false
        });
      } else if (resp.status === 400) {
        setMessage({
          type: 'error',
          text: resp.data?.error || 'Please fill all fields correctly'
        });
      } else if (resp.status === 409) {
        setMessage({
          type: 'error',
          text: 'This email is already registered'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Registration failed. Please try again.'
        });
      }
    } catch (error) {
      console.log(error);
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <section className='flex-grow flex items-center justify-center py-4 px-2 bg-gray-50'>
        <div className='w-full max-w-md'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white rounded-xl shadow-lg overflow-hidden'
          >
            <div className='p-8'>
              <div className='text-center mb-8'>
                <h2 className='text-3xl font-bold text-gray-900'>
                  Create your account
                </h2>
                <p className='mt-2 text-gray-600'>
                  Start your journey with ScheduleFlow today
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`rounded-md p-4 mb-6 ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className='flex'>
                    <div className='flex-shrink-0'>
                      {message.type === 'success'
                        ? (
                          <svg
                            className='h-5 w-5 text-green-500'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                            />
                          </svg>
                          )
                        : (
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
                          )}
                    </div>
                    <div className='ml-3'>
                      <p
                        className={`text-sm font-medium ${
                          message.type === 'success'
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label
                      htmlFor='firstName'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      First Name
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <User className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        type='text'
                        id='firstName'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='John'
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor='lastName'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Last Name
                    </label>
                    <input
                      type='text'
                      id='lastName'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='Doe'
                      required
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Email
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Mail className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='you@example.com'
                      required
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Phone Number
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Phone className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type='tel'
                      id='phone'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='+25400000000'
                      required
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Lock className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className='block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='********'
                      required
                      minLength={8}
                    />
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                      <button
                        type='button'
                        onClick={togglePasswordVisibility}
                        className='text-gray-400 hover:text-gray-500 focus:outline-none'
                      >
                        {showPassword
                          ? (
                            <EyeOff className='h-5 w-5' />
                            )
                          : (
                            <Eye className='h-5 w-5' />
                            )}
                      </button>
                    </div>
                  </div>
                  <p className='mt-1 text-xs text-gray-500'>
                    Password must be at least 8 characters
                  </p>
                </div>

                <div className='flex items-start mb-6'>
                  <div className='flex items-center h-5'>
                    <input
                      id='agreeToTerms'
                      name='agreeToTerms'
                      type='checkbox'
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                    />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label
                      htmlFor='agreeToTerms'
                      className='font-medium text-gray-700'
                    >
                      I agree to the{' '}
                      <a href='#' className='text-indigo-600 hover:underline'>
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting
                    ? (
                        'Creating account...'
                      )
                    : (
                      <>
                        Sign Up
                        <ArrowRight className='ml-2 h-5 w-5' />
                      </>
                      )}
                </button>
              </form>

              <p className='mt-4 text-sm text-gray-600 text-center'>
                Already have an account?{' '}
                <a
                  href='/auth/login'
                  className='text-indigo-600 hover:underline'
                >
                  Log in
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
