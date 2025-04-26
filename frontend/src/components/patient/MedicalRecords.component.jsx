'use client';

import { FileText, Download, Eye } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { medicalRecords } from '../../lib/mockData';

export default function MedicalRecords () {
  return (
    <div className='py-6 px-4 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>Medical Records</h2>
        <p className='text-gray-600 mt-1'>
          Access and download your medical documents
        </p>
      </div>

      <div className='bg-white shadow overflow-hidden rounded-lg'>
        <div className='px-4 py-5 sm:px-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Documents
            </h3>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search records...'
                className='pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
              />
            </div>
          </div>
        </div>
        <ul className='divide-y divide-gray-200'>
          {medicalRecords.map((record) => (
            <li key={record.id} className='px-4 py-4 sm:px-6 hover:bg-gray-50'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='bg-emerald-100 rounded-md p-2 mr-4'>
                    <FileText size={20} className='text-emerald-600' />
                  </div>
                  <div>
                    <h4 className='text-sm font-medium text-gray-900'>
                      {record.title}
                    </h4>
                    <div className='mt-1 flex items-center text-xs text-gray-500'>
                      <span>{formatDate(record.date)}</span>
                      <span className='mx-1'>•</span>
                      <span>{record.doctor}</span>
                      <span className='mx-1'>•</span>
                      <span>{record.type}</span>
                      <span className='mx-1'>•</span>
                      <span>{record.fileSize}</span>
                    </div>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <button className='p-2 text-gray-400 hover:text-gray-500'>
                    <Eye size={18} />
                  </button>
                  <button className='p-2 text-gray-400 hover:text-gray-500'>
                    <Download size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className='mt-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Request Medical Records
        </h3>
        <div className='bg-white shadow overflow-hidden rounded-lg'>
          <div className='p-6'>
            <p className='text-sm text-gray-600 mb-4'>
              Need additional medical records? Submit a request and we'll
              process it for you.
            </p>
            <form className='space-y-4'>
              <div>
                <label
                  htmlFor='record-type'
                  className='block text-sm font-medium text-gray-700'
                >
                  Record Type
                </label>
                <select
                  id='record-type'
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md'
                >
                  <option>Complete Medical History</option>
                  <option>Lab Results</option>
                  <option>Imaging Reports</option>
                  <option>Consultation Notes</option>
                  <option>Prescription History</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor='date-range'
                  className='block text-sm font-medium text-gray-700'
                >
                  Date Range
                </label>
                <div className='mt-1 flex space-x-3'>
                  <input
                    type='date'
                    id='date-from'
                    className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md'
                  />
                  <span className='flex items-center text-gray-500'>to</span>
                  <input
                    type='date'
                    id='date-to'
                    className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='notes'
                  className='block text-sm font-medium text-gray-700'
                >
                  Additional Notes
                </label>
                <textarea
                  id='notes'
                  rows={3}
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md'
                  placeholder='Any specific details about your request...'
                />
              </div>
              <div className='flex justify-end'>
                <button
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
