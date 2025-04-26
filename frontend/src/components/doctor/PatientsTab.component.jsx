import { useState } from 'react';
import { Card, CardContent } from '../ui/Card.component';
import { PatientForm } from './Forms.component';
import { PatientEditModal } from './Modal.component';
import Button from '../ui/Button.component';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

export function PatientsTab ({ patients: initialPatients }) {
  const [patients, setPatients] = useState(initialPatients);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  const handleAddPatient = (newPatient) => {
    setPatients([...patients, { ...newPatient, id: Date.now().toString() }]);
    setShowAddPatientForm(false);
  };

  const handleUpdatePatient = (updatedPatient) => {
    setPatients(
      patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setSelectedPatient(null);
  };

  const handleDeletePatient = (patientId) => {
    setPatients(patients.filter((patient) => patient.id !== patientId));
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Patients Management
        </h2>
        <Button
          onClick={() => setShowAddPatientForm(true)}
          className='bg-blue-600 hover:bg-blue-700'
        >
          <UserPlus className='h-4 w-4 mr-2' />
          Add New Patient
        </Button>
      </div>

      {showAddPatientForm && (
        <Card className='mb-6'>
          <CardContent className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Add New Patient
            </h3>
            <PatientForm
              onSubmit={handleAddPatient}
              onCancel={() => setShowAddPatientForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
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
                  Phone
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date of Birth
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Gender
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {patient.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {patient.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {patient.phone}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize'>
                    {patient.gender}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex justify-end space-x-2'>
                      <button
                        className='text-blue-600 hover:text-blue-900'
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Edit className='h-5 w-5' />
                      </button>
                      <button
                        className='text-red-600 hover:text-red-900'
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedPatient && (
        <PatientEditModal
          patient={selectedPatient}
          onUpdate={handleUpdatePatient}
          onCancel={() => setSelectedPatient(null)}
        />
      )}

      {error && (
        <div className='fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md'>
          <div className='flex'>
            <div className='py-1'>
              <svg
                className='h-6 w-6 text-red-500 mr-4'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <div>
              <p className='font-bold'>Error</p>
              <p className='text-sm'>{error}</p>
            </div>
            <div className='ml-auto'>
              <button
                className='text-red-500 hover:text-red-700'
                onClick={() => setError(null)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
