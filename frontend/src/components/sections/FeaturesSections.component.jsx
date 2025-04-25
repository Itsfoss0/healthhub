import { User, Calendar, FileText } from 'lucide-react';

export default function FeatureSection () {
  return (
    <>
      <section id='features' className='mb-20'>
        <h2 className='text-4xl font-bold mb-12 text-center'>Key Features</h2>
        <div className='grid md:grid-cols-3 gap-10'>
          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition'>
            <div className='bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6'>
              <User size={32} className='text-blue-600' />
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Patient Management</h3>
            <p className='text-lg'>
              Manage patient information and records in one place
            </p>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition'>
            <div className='bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6'>
              <Calendar size={32} className='text-blue-600' />
            </div>
            <h3 className='text-2xl font-semibold mb-4'>
              Appointment Scheduling
            </h3>
            <p className='text-lg'>Book & Schedule appointments with ease.</p>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition'>
            <div className='bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6'>
              <FileText size={32} className='text-blue-600' />
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Monitor Patients</h3>
            <p className='text-lg'>
              Access and update patient medical records securely from anywhere,
              anytime, as well as monitor patients in a program
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
