'use client';

import { Edit } from 'lucide-react';
import { EditProfileModal } from './Modals.component';
import { formatDate } from '../../lib/utils';
export default function ProfileSettings ({
  patient,
  showEditProfileModal,
  setShowEditProfileModal,
  handleEditProfile
}) {
  return (
    <div className='py-6 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='bg-white shadow overflow-hidden rounded-lg'>
          <div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
            <div>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Personal Information
              </h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                Your personal details and preferences
              </p>
            </div>
            <button
              onClick={() => setShowEditProfileModal(true)}
              className='flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700'
            >
              <Edit size={16} className='mr-2' />
              Edit Profile
            </button>
          </div>
          <div className='border-t border-gray-200'>
            <dl>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Full name</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.firstName} {patient.lastName}
                </dd>
              </div>
              <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Date of birth
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {formatDate(patient.dateOfBirth)}
                </dd>
              </div>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Gender</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.gender}
                </dd>
              </div>
              <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Email address
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.email}
                </dd>
              </div>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Phone number
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.phoneNumber}
                </dd>
              </div>
              <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Address</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.address}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className='mt-6 bg-white shadow overflow-hidden rounded-lg'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Emergency Contact
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Person to contact in case of emergency
            </p>
          </div>
          <div className='border-t border-gray-200'>
            <dl>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Name</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.emergencyContact?.name || 'Not provided'}
                </dd>
              </div>
              <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Relationship
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.emergencyContact?.relationship || 'Not provided'}
                </dd>
              </div>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Phone number
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {patient.emergencyContact?.phoneNumber || 'Not provided'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Change Password Section */}
        <div className='mt-6 bg-white shadow overflow-hidden rounded-lg'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Change Password
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Update your account password
            </p>
          </div>
          <div className='border-t border-gray-200 px-4 py-5 sm:p-6'>
            <form className='space-y-6'>
              <div>
                <label
                  htmlFor='current-password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Current Password
                </label>
                <input
                  type='password'
                  id='current-password'
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='new-password'
                  className='block text-sm font-medium text-gray-700'
                >
                  New Password
                </label>
                <input
                  type='password'
                  id='new-password'
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='confirm-password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm New Password
                </label>
                <input
                  type='password'
                  id='confirm-password'
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div className='flex justify-end'>
                <button
                  type='button'
                  className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <EditProfileModal
          setShowEditProfileModal={setShowEditProfileModal}
          handleEditProfile={handleEditProfile}
          patient={patient}
        />
      )}
    </div>
  );
}
