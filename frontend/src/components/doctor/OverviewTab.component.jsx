import { Card, CardContent } from '../ui/Card.component';

import { Activity, Calendar, ChevronRight, Users } from 'lucide-react';

export function OverviewTab ({ patients, programs, stats }) {
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          icon={<Users className='h-6 w-6 text-blue-600' />}
          title='Total Patients'
          value={stats.totalPatients}
          bgColor='bg-blue-100'
        />

        <StatCard
          icon={<Activity className='h-6 w-6 text-green-600' />}
          title='Active Programs'
          value={stats.activePrograms}
          bgColor='bg-green-100'
        />

        <StatCard
          icon={<Calendar className='h-6 w-6 text-purple-600' />}
          title='Completed Programs'
          value={stats.completedPrograms}
          bgColor='bg-purple-100'
        />

        <StatCard
          icon={<Calendar className='h-6 w-6 text-yellow-600' />}
          title='Recent Activities'
          value={patients.length + programs.length}
          bgColor='bg-yellow-100'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
            <h2 className='text-lg font-medium text-gray-900'>
              Recent Patients
            </h2>
            <button className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'>
              View all <ChevronRight className='h-4 w-4 ml-1' />
            </button>
          </div>
          <CardContent className='p-0'>
            <div className='divide-y divide-gray-200'>
              {patients.slice(0, 5).map((patient) => (
                <div
                  key={patient.id}
                  className='px-6 py-4 flex justify-between items-center'
                >
                  <div>
                    <p className='font-medium text-gray-900'>{patient.name}</p>
                    <p className='text-sm text-gray-500'>{patient.email}</p>
                  </div>
                  <div className='text-sm text-gray-500'>
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {patients.length === 0 && (
                <div className='px-6 py-4 text-gray-500 text-center'>
                  No patients found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Programs */}
        <Card>
          <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
            <h2 className='text-lg font-medium text-gray-900'>
              Active Programs
            </h2>
            <button className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'>
              View all <ChevronRight className='h-4 w-4 ml-1' />
            </button>
          </div>
          <CardContent className='p-0'>
            <div className='divide-y divide-gray-200'>
              {programs
                .filter((program) => program.status === 'active')
                .slice(0, 5)
                .map((program) => (
                  <div key={program.id} className='px-6 py-4'>
                    <div className='flex justify-between items-center'>
                      <p className='font-medium text-gray-900'>
                        {program.name}
                      </p>
                      <span className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                        Active
                      </span>
                    </div>
                    <p className='text-sm text-gray-500 mt-1'>
                      {program.description}
                    </p>
                    <div className='flex justify-between text-xs text-gray-500 mt-2'>
                      <span>
                        Start:{' '}
                        {new Date(program.startDate).toLocaleDateString()}
                      </span>
                      <span>
                        End: {new Date(program.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              {programs.filter((program) => program.status === 'active')
                .length === 0 && (
                  <div className='px-6 py-4 text-gray-500 text-center'>
                    No active programs found
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard ({ icon, title, value, bgColor }) {
  return (
    <Card>
      <CardContent className='p-6 mt-3'>
        <div className='flex items-center'>
          <div className={`${bgColor} p-3 rounded-full`}>{icon}</div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>{title}</p>
            <p className='text-2xl font-semibold text-gray-900'>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
