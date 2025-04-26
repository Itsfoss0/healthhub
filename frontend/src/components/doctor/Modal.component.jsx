import { PatientForm, ProgramForm } from './Forms.component';

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
