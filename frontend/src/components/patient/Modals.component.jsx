import { X } from 'lucide-react';

export function EditProfileModal ({
  setShowEditProfileModal,
  handleEditProfile,
  patient
}) {
  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-medium text-gray-900'>Edit Profile</h3>
            <button
              onClick={() => setShowEditProfileModal(false)}
              className='text-gray-400 hover:text-gray-500'
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleEditProfile}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-gray-700'
                >
                  First Name
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  defaultValue={patient.firstName}
                  required
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last Name
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  defaultValue={patient.lastName}
                  required
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  defaultValue={patient.email}
                  required
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='phoneNumber'
                  className='block text-sm font-medium text-gray-700'
                >
                  Phone Number
                </label>
                <input
                  type='tel'
                  id='phoneNumber'
                  name='phoneNumber'
                  defaultValue={patient.phoneNumber}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='address'
                  className='block text-sm font-medium text-gray-700'
                >
                  Address
                </label>
                <input
                  type='text'
                  id='address'
                  name='address'
                  defaultValue={patient.address}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                />
              </div>
              <div>
                <h4 className='text-sm font-medium text-gray-700 mb-2'>
                  Emergency Contact
                </h4>
                <div className='space-y-3'>
                  <div>
                    <label
                      htmlFor='emergencyName'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Name
                    </label>
                    <input
                      type='text'
                      id='emergencyName'
                      name='emergencyName'
                      defaultValue={patient.emergencyContact?.name || ''}
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='emergencyRelationship'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Relationship
                    </label>
                    <input
                      type='text'
                      id='emergencyRelationship'
                      name='emergencyRelationship'
                      defaultValue={
                        patient.emergencyContact?.relationship || ''
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='emergencyPhone'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      id='emergencyPhone'
                      name='emergencyPhone'
                      defaultValue={patient.emergencyContact?.phoneNumber || ''}
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-6 flex justify-end space-x-3'>
              <button
                type='button'
                onClick={() => setShowEditProfileModal(false)}
                className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
