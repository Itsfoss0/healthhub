import { useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card.component';
import { ProgramForm } from './Forms.component';
import { ProgramEditModal } from './Modal.component';
import Button from '../ui/Button.component';

export function ProgramsTab ({ programs: initialPrograms }) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [showAddProgramForm, setShowAddProgramForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [error, setError] = useState(null);

  const handleAddProgram = (newProgram) => {
    setPrograms([...programs, { ...newProgram, id: Date.now().toString() }]);
    setShowAddProgramForm(false);
  };

  const handleUpdateProgram = (updatedProgram) => {
    setPrograms(
      programs.map((p) => (p.id === updatedProgram.id ? updatedProgram : p))
    );
    setSelectedProgram(null);
  };

  const handleDeleteProgram = (programId) => {
    setPrograms(programs.filter((program) => program.id !== programId));
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Programs Management
        </h2>
        <Button
          onClick={() => setShowAddProgramForm(true)}
          className='bg-blue-600 hover:bg-blue-700'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add New Program
        </Button>
      </div>

      {showAddProgramForm && (
        <Card className='mb-6'>
          <CardContent className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Add New Program
            </h3>
            <ProgramForm
              onSubmit={handleAddProgram}
              onCancel={() => setShowAddProgramForm(false)}
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
                  Program Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Duration
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Capacity
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {program.name}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                    {program.description}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(program.startDate).toLocaleDateString()} -{' '}
                    {new Date(program.endDate).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        program.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : program.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {program.status.charAt(0).toUpperCase() +
                        program.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {program.capacity}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex justify-end space-x-2'>
                      <button
                        className='text-blue-600 hover:text-blue-900'
                        onClick={() => setSelectedProgram(program)}
                      >
                        <Edit className='h-5 w-5' />
                      </button>
                      <button
                        className='text-red-600 hover:text-red-900'
                        onClick={() => handleDeleteProgram(program.id)}
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {programs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    No programs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedProgram && (
        <ProgramEditModal
          program={selectedProgram}
          onUpdate={handleUpdateProgram}
          onCancel={() => setSelectedProgram(null)}
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
