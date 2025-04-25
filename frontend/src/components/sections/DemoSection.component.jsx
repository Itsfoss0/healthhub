import { useState } from 'react';

import { User, Calendar, MessageCircle, Settings } from 'lucide-react';

export default function DemoSection () {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <section className='mb-20'>
        <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-10 rounded-lg shadow-sm'>
          <h2 className='text-4xl font-bold mb-6 text-center'>
            Experience HealthHub
          </h2>
          <p className='text-center mb-10 text-xl'>
            See how our hospital management system can transform your healthcare
            facility
          </p>

          <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            <div className='flex border-b'>
              <button
                onClick={() => setActiveTab('home')}
                className={`px-6 py-4 text-lg ${
                  activeTab === 'home'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-6 py-4 text-lg ${
                  activeTab === 'patients'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Patients
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-6 py-4 text-lg ${
                  activeTab === 'appointments'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Programs
              </button>
            </div>

            <div className='p-8'>
              {activeTab === 'home' && (
                <div className='text-center p-12'>
                  <h3 className='text-2xl font-semibold mb-4'>
                    Welcome to Your Dashboard
                  </h3>
                  <p className='text-gray-600 mb-6 text-lg'>
                    Access all your healthcare tools in one place
                  </p>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-10'>
                    <div className='p-6 bg-gray-50 rounded-lg'>
                      <Calendar
                        size={32}
                        className='mx-auto mb-3 text-blue-600'
                      />
                      <span className='text-lg'>Programs</span>
                    </div>
                    <div className='p-6 bg-gray-50 rounded-lg'>
                      <User size={32} className='mx-auto mb-3 text-blue-600' />
                      <span className='text-lg'>Patients</span>
                    </div>
                    <div className='p-6 bg-gray-50 rounded-lg'>
                      <MessageCircle
                        size={32}
                        className='mx-auto mb-3 text-blue-600'
                      />
                      <span className='text-lg'>Messages</span>
                    </div>
                    <div className='p-6 bg-gray-50 rounded-lg'>
                      <Settings
                        size={32}
                        className='mx-auto mb-3 text-blue-600'
                      />
                      <span className='text-lg'>Settings</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'patients' && (
                <div className='text-center p-12'>
                  <h3 className='text-2xl font-semibold mb-4'>
                    Patient Management
                  </h3>
                  <p className='text-gray-600 text-lg'>
                    View and manage your patient records
                  </p>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className='text-center p-12'>
                  <h3 className='text-2xl font-semibold mb-4'>
                    Program Calendar
                  </h3>
                  <p className='text-gray-600 text-lg'>
                    Add and manage programs here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
