import { Loader2 } from 'lucide-react';

export function Spinner ({ text = 'Loading...' }) {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <Loader2 size={60} className='text-blue-600 animate-spin' />
      {text && <p className='text-gray-600 text-sm font-medium'>{text}</p>}
    </div>
  );
}
