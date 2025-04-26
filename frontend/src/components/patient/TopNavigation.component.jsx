'use client';

import { Bell } from 'lucide-react';

export default function TopNavigation ({ activeSection, patient }) {
  return (
    <header className='bg-white shadow-sm'>
      <div className='px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            {activeSection === 'overview' && 'Patient Dashboard'}
            {activeSection === 'programs' && 'My Programs'}
            {activeSection === 'doctors' && 'My Doctors'}
            {activeSection === 'records' && 'Medical Records'}
            {activeSection === 'profile' && 'Profile Settings'}
          </h1>

          <div className='flex items-center space-x-4'>
            <button className='relative p-2 rounded-full hover:bg-gray-100'>
              <Bell size={20} className='text-gray-600' />
              <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500' />
            </button>

            <div className='flex items-center'>
              <div className='hidden md:block'>
                <p className='text-sm font-medium'>
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div className='ml-3 relative'>
                <div className='h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white'>
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
