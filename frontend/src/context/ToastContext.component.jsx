import { createContext, useContext } from 'react';
import { useToast } from '../hooks/toastHook.hook';
import { ToastContainer, Toast } from '../components/ui/Toast.component';

const ToastContext = createContext(null);

export function ToastProvider ({ children }) {
  const { toasts, toast, dismiss } = useToast();

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer>
        {toasts.map(({ id, title, description, variant }) => (
          <Toast key={id} title={title} description={description} variant={variant} onClose={() => dismiss(id)} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToastContext () {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
