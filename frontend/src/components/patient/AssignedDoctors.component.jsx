'use client';

import { Mail, Phone, Star } from 'lucide-react';

export default function AssignedDoctors ({ assignedDoctors }) {
  return (
    <div className='py-6 px-4 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>
          My Healthcare Team
        </h2>
        <p className='text-gray-600 mt-1'>
          Your assigned doctors and specialists
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {assignedDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className='bg-white rounded-lg shadow overflow-hidden'
          >
            <div className='p-6'>
              <div className='flex items-center mb-4'>
                <div className='h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-lg'>
                  {doctor.firstName[0]}
                  {doctor.lastName[0]}
                </div>
                <div className='ml-4'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className='text-sm text-gray-500'>{doctor.specialty}</p>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center text-sm'>
                  <Star className='h-4 w-4 text-yellow-400 mr-1' />
                  <Star className='h-4 w-4 text-yellow-400 mr-1' />
                  <Star className='h-4 w-4 text-yellow-400 mr-1' />
                  <Star className='h-4 w-4 text-yellow-400 mr-1' />
                  <Star className='h-4 w-4 text-gray-300 mr-1' />
                  <span className='text-gray-600 ml-1'>4.0</span>
                </div>

                <div className='flex items-center text-sm text-gray-600'>
                  <Mail className='h-4 w-4 mr-2' />
                  <span>{doctor.email}</span>
                </div>

                <div className='flex items-center text-sm text-gray-600'>
                  <Phone className='h-4 w-4 mr-2' />
                  <span>{doctor.phoneNumber}</span>
                </div>
              </div>

              <div className='mt-6 flex space-x-3'>
                <button className='flex-1 bg-emerald-100 text-emerald-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-200'>
                  Message
                </button>
                <button className='flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700'>
                  Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {assignedDoctors.length === 0 && (
        <div className='bg-white rounded-lg shadow p-6 text-center'>
          <p className='text-gray-500'>
            You don't have any assigned doctors yet.
          </p>
        </div>
      )}
    </div>
  );
}
