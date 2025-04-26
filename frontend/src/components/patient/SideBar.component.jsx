'use client';

import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

export default function Sidebar ({
  sidebarOpen,
  toggleSidebar,
  activeSection,
  setActiveSection
}) {
  return (
    <aside
      className={`bg-emerald-700 text-white ${
        sidebarOpen ? 'w-64' : 'w-20'
      } hidden md:block transition-all duration-300 ease-in-out overflow-y-auto`}
    >
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          {sidebarOpen && <h2 className='text-xl font-bold'>HealthHub</h2>}
          <button
            onClick={toggleSidebar}
            className='p-2 rounded-md hover:bg-emerald-600'
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <nav className='mt-10 px-4'>
        <div className='space-y-2'>
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-emerald-600 transition-colors ${
              activeSection === 'overview' ? 'bg-emerald-600' : ''
            }`}
          >
            <Home size={sidebarOpen ? 20 : 24} />
            {sidebarOpen && <span className='ml-4'>Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveSection('programs')}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-emerald-600 transition-colors ${
              activeSection === 'programs' ? 'bg-emerald-600' : ''
            }`}
          >
            <Calendar size={sidebarOpen ? 20 : 24} />
            {sidebarOpen && <span className='ml-4'>My Programs</span>}
          </button>

          <button
            onClick={() => setActiveSection('doctors')}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-emerald-600 transition-colors ${
              activeSection === 'doctors' ? 'bg-emerald-600' : ''
            }`}
          >
            <Users size={sidebarOpen ? 20 : 24} />
            {sidebarOpen && <span className='ml-4'>My Doctors</span>}
          </button>

          <button
            onClick={() => setActiveSection('records')}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-emerald-600 transition-colors ${
              activeSection === 'records' ? 'bg-emerald-600' : ''
            }`}
          >
            <FileText size={sidebarOpen ? 20 : 24} />
            {sidebarOpen && <span className='ml-4'>Medical Records</span>}
          </button>

          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-emerald-600 transition-colors ${
              activeSection === 'profile' ? 'bg-emerald-600' : ''
            }`}
          >
            <Settings size={sidebarOpen ? 20 : 24} />
            {sidebarOpen && <span className='ml-4'>Profile</span>}
          </button>
        </div>
      </nav>

      <div className='mt-56 p-4'>
        <button
          className={`flex items-center ${
            sidebarOpen ? 'w-full' : 'w-12 justify-center'
          } p-3 rounded-lg hover:bg-emerald-600 transition-colors`}
          onClick={() => console.log('Logout clicked')}
        >
          <LogOut size={sidebarOpen ? 20 : 24} />
          {sidebarOpen && <span className='ml-4'>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
