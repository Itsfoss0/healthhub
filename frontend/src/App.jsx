import AuthProvider from './context/AuthContext.context';
import { ToastProvider } from './context/ToastContext.component';
import AppRouter from './routes/mainRouter.route';

export default function App () {
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </>
  );
}
