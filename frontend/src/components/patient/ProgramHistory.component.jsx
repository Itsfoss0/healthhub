'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function ProgramHistory ({ programHistory }) {
  const [filter, setFilter] = useState('all');

  const filteredPrograms =
    filter === 'all'
      ? programHistory
      : programHistory.filter((program) => program.status === filter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock size={16} className='text-blue-500' />;
      case 'completed':
        return <CheckCircle size={16} className='text-emerald-500' />;
      case 'withdrawn':
        return <XCircle size={16} className='text-red-500' />;
      case 'pending':
        return <Clock size={16} className='text-yellow-500' />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'withdrawn':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='py-6 px-4 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>
          My Treatment Programs
        </h2>
        <p className='text-gray-600 mt-1'>
          View your current and past treatment programs
        </p>
      </div>

      {/* Filter Tabs */}
      <div className='mb-6 border-b border-gray-200'>
        <nav className='flex -mb-px space-x-8'>
          <button
            onClick={() => setFilter('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Programs
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'active'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'completed'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'pending'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending
          </button>
        </nav>
      </div>

      <div className='bg-white shadow overflow-hidden rounded-lg'>
        {filteredPrograms.length > 0
          ? (
            <div className='divide-y divide-gray-200'>
              {filteredPrograms.map((programEntry, index) => (
                <div key={index} className='p-6 hover:bg-gray-50'>
                  <div className='flex items-start'>
                    <div className='bg-emerald-100 rounded-full p-3 mr-4'>
                      <Calendar size={24} className='text-emerald-600' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <h4 className='text-lg font-medium text-gray-900'>
                          {programEntry.program.name}
                        </h4>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          programEntry.status
                        )}`}
                        >
                          {getStatusIcon(programEntry.status)}
                          <span className='ml-1'>
                            {programEntry.status.charAt(0).toUpperCase() +
                            programEntry.status.slice(1)}
                          </span>
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 mt-1'>
                        {programEntry.program.description}
                      </p>
                      <div className='mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div>
                          <span className='text-xs text-gray-500'>
                            Admission Date:
                          </span>
                          <p className='text-sm font-medium'>
                            {formatDate(programEntry.admissionDate)}
                          </p>
                        </div>
                        {programEntry.dischargeDate && (
                          <div>
                            <span className='text-xs text-gray-500'>
                              Discharge Date:
                            </span>
                            <p className='text-sm font-medium'>
                              {formatDate(programEntry.dischargeDate)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className='mt-4'>
                        <button className='text-sm text-emerald-600 hover:text-emerald-500 font-medium'>
                          View Details
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
              No programs found matching the selected filter.
            </div>
            )}
      </div>
    </div>
  );
}
