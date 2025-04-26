'use client';

import {
  X,
  Menu,
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

export default function MobileMenu ({
  activeMobileMenu,
  setActiveMobileMenu,
  setActiveSection
}) {
  return (
    <>
      <div className='md:hidden fixed bottom-6 right-6 z-50'>
        <button
          onClick={() => setActiveMobileMenu(!activeMobileMenu)}
          className='bg-emerald-600 text-white p-4 rounded-full shadow-lg'
        >
          {activeMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {activeMobileMenu && (
        <div className='md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex items-end justify-center pb-20'>
          <div className='bg-white rounded-t-xl w-full max-w-sm shadow-xl'>
            <div className='p-4 border-b'>
              <h3 className='text-lg font-medium'>Menu</h3>
            </div>
            <nav className='p-4'>
              <div className='space-y-3'>
                <button
                  onClick={() => {
                    setActiveSection('overview');
                    setActiveMobileMenu(false);
                  }}
                  className='flex items-center w-full p-3 rounded-lg hover:bg-gray-100'
                >
                  <Home size={20} className='text-emerald-600' />
                  <span className='ml-4'>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('programs');
                    setActiveMobileMenu(false);
                  }}
                  className='flex items-center w-full p-3 rounded-lg hover:bg-gray-100'
                >
                  <Calendar size={20} className='text-emerald-600' />
                  <span className='ml-4'>My Programs</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('doctors');
                    setActiveMobileMenu(false);
                  }}
                  className='flex items-center w-full p-3 rounded-lg hover:bg-gray-100'
                >
                  <Users size={20} className='text-emerald-600' />
                  <span className='ml-4'>My Doctors</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('records');
                    setActiveMobileMenu(false);
                  }}
                  className='flex items-center w-full p-3 rounded-lg hover:bg-gray-100'
                >
                  <FileText size={20} className='text-emerald-600' />
                  <span className='ml-4'>Medical Records</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('profile');
                    setActiveMobileMenu(false);
                  }}
                  className='flex items-center w-full p-3 rounded-lg hover:bg-gray-100'
                >
                  <Settings size={20} className='text-emerald-600' />
                  <span className='ml-4'>Profile</span>
                </button>

                <button
                  onClick={() => console.log('Logout clicked')}
                  className='flex items-center w-full p-3 rounded-lg hover:bg-gray-100'
                >
                  <LogOut size={20} className='text-emerald-600' />
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
