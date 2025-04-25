import { X, Menu } from 'lucide-react';
import { useState } from 'react';

export default function NavBar () {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className='bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md'>
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-20'>
            <div className='flex items-center'>
              <a href='/'>
                <span className='text-3xl mr-2'>⚕️</span>
                <span className='font-bold text-2xl'>HealthHub</span>
              </a>
            </div>

            <div className='hidden md:flex items-center space-x-6'>
              <a
                href='#features'
                className='px-4 py-2 rounded-md text-lg hover:bg-blue-500 transition'
              >
                Features
              </a>
              <a
                href='/demo'
                className='px-4 py-2 rounded-md text-lg hover:bg-blue-500 transition'
              >
                Product Demo
              </a>
              <a
                href='#testimonials'
                className='px-4 py-2 rounded-md text-lg hover:bg-blue-500 transition'
              >
                Testimonials
              </a>
              <a
                href='#contact'
                className='px-4 py-2 rounded-md text-lg hover:bg-blue-500 transition'
              >
                Contact
              </a>
              <button className='ml-4 px-6 py-3 bg-white text-blue-600 font-medium text-lg rounded-full shadow hover:shadow-lg transition transform hover:-translate-y-0.5'>
                Log In
              </button>
            </div>

            <div className='md:hidden flex items-center'>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='p-2 rounded-md focus:outline-none'
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-blue-500'>
              <a
                href='#features'
                className='block px-4 py-3 text-lg rounded-md hover:bg-blue-600 transition'
              >
                Features
              </a>
              <a
                href='#benefits'
                className='block px-4 py-3 text-lg rounded-md hover:bg-blue-600 transition'
              >
                Benefits
              </a>
              <a
                href='#testimonials'
                className='block px-4 py-3 text-lg rounded-md hover:bg-blue-600 transition'
              >
                Testimonials
              </a>
              <a
                href='#contact'
                className='block px-4 py-3 text-lg rounded-md hover:bg-blue-600 transition'
              >
                Contact
              </a>
              <button className='w-full mt-2 px-4 py-3 bg-white text-blue-600 font-medium text-lg rounded-full shadow'>
                Log In
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
