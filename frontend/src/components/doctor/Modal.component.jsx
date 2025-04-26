import { useState } from 'react';
import Button from '../ui/Button.component';
import Input from '../ui/Input.component';
import { PatientForm, ProgramForm } from './Forms.component';
import { Search, UserMinus } from 'lucide-react';

export function PatientEditModal ({ patient, onUpdate, onCancel }) {
  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>Edit Patient</h3>
        </div>
        <div className='p-6'>
          <PatientForm
            patient={patient}
            onSubmit={onUpdate}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
}

export function ProgramEditModal ({ program, onUpdate, onCancel }) {
  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>Edit Program</h3>
        </div>
        <div className='p-6'>
          <ProgramForm
            program={program}
            onSubmit={onUpdate}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
}

export function PatientProgramsModal ({
  patient,
  programs,
  enrollments,
  onClose
}) {
  const patientPrograms = enrollments.map((enrollment) => {
    const program = programs.find((p) => p.id === enrollment.programId);
    return {
      ...enrollment,
      program
    };
  });

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>
            Programs for {patient.firstName}
          </h3>
        </div>
        <div className='p-6'>
          {patientPrograms.length === 0
            ? (
              <div className='text-center py-4 text-gray-500'>
                This patient is not enrolled in any programs.
              </div>
              )
            : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Program Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Enrollment Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {patientPrograms.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {enrollment.program?.name || 'Unknown Program'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            enrollment.program?.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : enrollment.program?.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          } capitalize`}
                          >
                            {enrollment.program?.status || 'Unknown'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(
                            enrollment.enrollmentDate
                          ).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {enrollment.program
                            ? (
                              <>
                                {new Date(
                                  enrollment.program.startDate
                                ).toLocaleDateString()}{' '}
                                -{' '}
                                {new Date(
                                  enrollment.program.endDate
                                ).toLocaleDateString()}
                              </>
                              )
                            : (
                                'N/A'
                              )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}

          <div className='mt-6 flex justify-end'>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EnrollPatientModal ({
  program,
  patients,
  enrollments,
  onEnroll,
  onCancel
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const enrolledPatientIds = enrollments
    .filter((enrollment) => enrollment.programId === program.id)
    .map((enrollment) => enrollment.patientId);

  const availablePatients = patients.filter(
    (patient) => !enrolledPatientIds.includes(patient.id) && patient.isActive
  );

  const filteredPatients = availablePatients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>
            Enroll Patient in {program.name}
          </h3>
        </div>
        <div className='p-6'>
          <div className='mb-4'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='text'
                placeholder='Search patients...'
                className='pl-10'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {availablePatients.length === 0
            ? (
              <div className='text-center py-4 text-gray-500'>
                All patients are already enrolled in this program.
              </div>
              )
            : filteredPatients.length === 0
              ? (
                <div className='text-center py-4 text-gray-500'>
                  No patients found matching "{searchTerm}".
                </div>
                )
              : (
                <div className='max-h-60 overflow-y-auto border border-gray-200 rounded-md'>
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className='p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer'
                      onClick={() => onEnroll(program.id, patient.id)}
                    >
                      <div className='font-medium'>
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className='text-sm text-gray-500'>{patient.email}</div>
                    </div>
                  ))}
                </div>
                )}

          <div className='mt-6 flex justify-end'>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProgramEnrollmentsModal ({
  program,
  patients,
  enrollments,
  onRemoveEnrollment,
  onClose
}) {
  const enrolledPatients = enrollments.map((enrollment) => {
    const patient = patients.find((p) => p.id === enrollment.patientId);
    return {
      ...enrollment,
      patient
    };
  });

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>
            Patients Enrolled in {program.name} ({enrolledPatients.length} /{' '}
            {program.capacity})
          </h3>
        </div>
        <div className='p-6'>
          {enrolledPatients.length === 0
            ? (
              <div className='text-center py-4 text-gray-500'>
                No patients are currently enrolled in this program.
              </div>
              )
            : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Patient Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Enrollment Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {enrolledPatients.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {enrollment.patient?.firstName || 'Unknown Patient'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {enrollment.patient?.email || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(
                            enrollment.enrollmentDate
                          ).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize'>
                            {enrollment.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <button
                            className='text-red-600 hover:text-red-900'
                            onClick={() => onRemoveEnrollment(enrollment.id)}
                            title='Remove from program'
                          >
                            <UserMinus className='h-5 w-5' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}

          <div className='mt-6 flex justify-end'>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
