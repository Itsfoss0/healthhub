import { useState } from 'react';
import {
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger
} from '../components/ui/Tabs.component';
import { User } from 'lucide-react';
import { OverviewTab } from '../components/doctor/OverviewTab.component';
import { PatientsTab } from '../components/doctor/PatientsTab.component';
import { ProgramsTab } from '../components/doctor/ProgramsTab.component';
import { useMockData } from '../hooks/mockHook.hook';

export default function DoctorDashboard () {
  const { doctor, patients, programs, stats, loading, error } = useMockData();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-xl font-semibold'>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-red-600 text-xl font-semibold'>{error}</div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Doctor Dashboard
            </h1>
            {doctor && (
              <div className='flex items-center space-x-2'>
                <div className='bg-blue-100 p-2 rounded-full'>
                  <User className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {doctor.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {doctor.specialization}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Tabs defaultValue='overview' onValueChange={setActiveTab}>
          <TabsList className='mb-6 border-b border-gray-200 w-full justify-start rounded-none bg-transparent p-0'>
            <TabsTrigger
              value='overview'
              className='px-4 py-2 font-medium text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 bg-transparent'
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='patients'
              className='px-4 py-2 font-medium text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 bg-transparent'
            >
              Patients
            </TabsTrigger>
            <TabsTrigger
              value='programs'
              className='px-4 py-2 font-medium text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 bg-transparent'
            >
              Programs
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview'>
            <OverviewTab
              patients={patients}
              programs={programs}
              stats={stats}
            />
          </TabsContent>

          <TabsContent value='patients'>
            <PatientsTab patients={patients} />
          </TabsContent>

          <TabsContent value='programs'>
            <ProgramsTab programs={programs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
