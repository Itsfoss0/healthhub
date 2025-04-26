import { useNavigate } from 'react-router-dom';

export default function HeroSection () {
  const navigate = useNavigate();
  return (
    <>
      <div className='bg-gradient-to-r from-blue-400 to-blue-600 text-white'>
        <div className='max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='text-5xl md:text-6xl font-bold mb-8'>
                Welcome to HealthHub
              </h1>
              <p className='text-2xl mb-10'>
                A comprehensive health information system for doctors to manage
                programs and clients
              </p>
              <div className='flex flex-wrap gap-6'>
                <button
                  onClick={() => navigate('/auth/signup')}
                  className='px-8 py-4 bg-white text-blue-600 font-medium text-xl rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1'
                >
                  Get Started
                </button>
                <button className='px-8 py-4 bg-transparent border-2 border-white text-white text-xl font-medium rounded-full hover:bg-white hover:text-blue-600 transition'>
                  Watch Demo
                </button>
              </div>
            </div>
            <div className='hidden md:block'>
              <div className='bg-white p-10 rounded-lg shadow-lg'>
                <div className='flex items-center justify-center h-72'>
                  <span className='text-9xl text-blue-500'>⚕️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
