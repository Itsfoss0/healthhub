'use client';

import { Calendar, Users, FileText, Activity, Clock } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { upcomingAppointments } from '../../lib/mockData';

export default function DashboardOverview ({ patient, setActiveSection }) {
  const activePrograms = patient.programHistory.filter(
    (program) => program.status === 'active'
  );
  return (
    <div className='py-6 px-4 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Welcome back, {patient.firstName}!
        </h2>
        <p className='text-gray-600 mt-1'>
          Here's an overview of your health journey
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='bg-emerald-100 rounded-md p-3'>
              <Calendar size={24} className='text-emerald-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Active Programs
              </h3>
              <p className='text-3xl font-bold text-gray-900'>
                {activePrograms.length}
              </p>
              <p className='text-sm text-gray-500'>
                Current treatment programs
              </p>
            </div>
          </div>
          <button
            className='mt-4 text-emerald-600 text-sm font-medium hover:text-emerald-500'
            onClick={() => setActiveSection('programs')}
          >
            View all programs →
          </button>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='bg-emerald-100 rounded-md p-3'>
              <Users size={24} className='text-emerald-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-medium text-gray-900'>My Doctors</h3>
              <p className='text-3xl font-bold text-gray-900'>
                {patient.assignedDoctors.length}
              </p>
              <p className='text-sm text-gray-500'>Healthcare providers</p>
            </div>
          </div>
          <button
            className='mt-4 text-emerald-600 text-sm font-medium hover:text-emerald-500'
            onClick={() => setActiveSection('doctors')}
          >
            View all doctors →
          </button>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='bg-emerald-100 rounded-md p-3'>
              <FileText size={24} className='text-emerald-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Medical Records
              </h3>
              <p className='text-3xl font-bold text-gray-900'>12</p>
              <p className='text-sm text-gray-500'>Available documents</p>
            </div>
          </div>
          <button
            className='mt-4 text-emerald-600 text-sm font-medium hover:text-emerald-500'
            onClick={() => setActiveSection('records')}
          >
            View all records →
          </button>
        </div>
      </div>

      <div className='mt-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Health Metrics
        </h3>
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='flex items-center'>
              <div className='bg-emerald-100 rounded-full p-3 mr-4'>
                <Activity size={24} className='text-emerald-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Blood Pressure</p>
                <p className='text-xl font-semibold'>120/80 mmHg</p>
                <p className='text-xs text-emerald-600'>Normal range</p>
              </div>
            </div>
            <div className='flex items-center'>
              <div className='bg-emerald-100 rounded-full p-3 mr-4'>
                <Activity size={24} className='text-emerald-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Heart Rate</p>
                <p className='text-xl font-semibold'>72 bpm</p>
                <p className='text-xs text-emerald-600'>Normal range</p>
              </div>
            </div>
            <div className='flex items-center'>
              <div className='bg-emerald-100 rounded-full p-3 mr-4'>
                <Activity size={24} className='text-emerald-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Blood Glucose</p>
                <p className='text-xl font-semibold'>95 mg/dL</p>
                <p className='text-xs text-emerald-600'>Normal range</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Upcoming Appointments
        </h3>
        <div className='bg-white shadow overflow-hidden rounded-lg'>
          {upcomingAppointments.length > 0
            ? (
              <div className='divide-y divide-gray-200'>
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className='p-6'>
                    <div className='flex items-start'>
                      <div className='bg-emerald-100 rounded-full p-3 mr-4'>
                        <Clock size={24} className='text-emerald-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex justify-between'>
                          <h4 className='text-lg font-medium text-gray-900'>
                            {appointment.doctorName}
                          </h4>
                          <span className='text-sm text-gray-500'>
                            {formatDate(appointment.date)}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          {appointment.specialty}
                        </p>
                        <p className='text-sm text-gray-500 mt-1'>
                          {appointment.location}
                        </p>
                        <div className='mt-3 flex space-x-3'>
                          <button className='text-sm text-emerald-600 hover:text-emerald-500'>
                            Reschedule
                          </button>
                          <button className='text-sm text-red-600 hover:text-red-500'>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )
            : (
              <div className='p-6 text-center text-gray-500'>
                No upcoming appointments
              </div>
              )}
        </div>
      </div>
    </div>
  );
}
