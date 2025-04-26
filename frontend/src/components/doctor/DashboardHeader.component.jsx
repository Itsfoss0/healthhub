import { User } from 'lucide-react';

export function DashboardHeader ({ doctor }) {
  return (
    <div className='bg-white shadow'>
      <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900'>Doctor Dashboard</h1>
          {doctor && (
            <div className='flex items-center space-x-2'>
              <div className='bg-blue-100 p-2 rounded-full'>
                <User className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  {doctor.firstName} {doctor.lastName}
                </p>
                <p className='text-xs text-gray-500'>Doctor</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
