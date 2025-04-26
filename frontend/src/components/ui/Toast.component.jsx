'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const TOAST_DURATION = 5000;

export function Toast ({ title, description, variant = 'default', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Allow time for exit animation
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        variant === 'default' && 'bg-white border-gray-200',
        variant === 'success' && 'bg-green-50 border-green-200',
        variant === 'error' && 'bg-red-50 border-red-200',
        variant === 'warning' && 'bg-yellow-50 border-yellow-200'
      )}
    >
      <div className='grid gap-1'>
        {title && (
          <div
            className={cn(
              'text-sm font-semibold',
              variant === 'default' && 'text-gray-900',
              variant === 'success' && 'text-green-800',
              variant === 'error' && 'text-red-800',
              variant === 'warning' && 'text-yellow-800'
            )}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            className={cn(
              'text-sm opacity-90',
              variant === 'default' && 'text-gray-500',
              variant === 'success' && 'text-green-700',
              variant === 'error' && 'text-red-700',
              variant === 'warning' && 'text-yellow-700'
            )}
          >
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            onClose?.();
          }, 300);
        }}
        className={cn(
          'absolute right-2 top-2 rounded-md p-1',
          variant === 'default' && 'text-gray-500 hover:text-gray-900',
          variant === 'success' && 'text-green-600 hover:text-green-900',
          variant === 'error' && 'text-red-600 hover:text-red-900',
          variant === 'warning' && 'text-yellow-600 hover:text-yellow-900'
        )}
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );
}

export function ToastContainer ({ children }) {
  return (
    <div className='fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]'>
      {children}
    </div>
  );
}
