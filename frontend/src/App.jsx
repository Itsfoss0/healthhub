import AuthProvider from './context/AuthContext.context';
import AppRouter from './routes/mainRouter.route';

export default function App () {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
}
