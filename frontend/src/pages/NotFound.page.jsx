import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button.component';

export default function NotFound () {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='flex justify-center mb-6'>
          <div className='bg-blue-100 p-6 rounded-full'>
            <FileQuestion className='h-16 w-16 text-blue-600' />
          </div>
        </div>

        <h1 className='text-6xl font-bold text-gray-900 mb-2'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          Page Not Found
        </h2>

        <p className='text-gray-500 mb-8'>
          The page you are looking for doesn't exist or has been moved. Please
          check the URL or navigate back to the dashboard.
        </p>

        <div className='flex flex-col p-3 sm:flex-row gap-4 justify-center align-center'>
          <Button asChild className='bg-blue-600 h-20 hover:bg-blue-700'>
            <a href='/'>
              <Home className='h-6 w-4 mr-2' />
              Back to Dashboard
            </a>
          </Button>

          <Button asChild variant='outline' className='h-20'>
            <a href='/'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Go Back
            </a>
          </Button>
        </div>
      </div>

      <div className='mt-16 text-center'>
        <p className='text-sm text-gray-500'>
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
