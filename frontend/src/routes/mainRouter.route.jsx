import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.page';
import DemoPage from '../pages/DemoPage.page';
import SignupPage from '../pages/Signup.page';
import ForgotPassword from '../pages/ForgotPassword.page';
import LoginPage from '../pages/LoginPage.page';
import PatientDashboard from '../components/patient/PatientDashboard.component';
import DoctorDashboard from '../pages/DoctorDashboard.component';
import NotFound from '../pages/NotFound.page';
import VerificationStatus from '../components/auth/VerificationStatus.component';
import LoginRequired from './privateRouter.route';

export default function AppRouter () {
  return (
    <Routes>
      <Route path='' index element={<LandingPage />} />
      <Route path='/demo' element={<DemoPage />} />
      <Route
        path='/patient'
        element={
          <LoginRequired>
            {' '}
            <PatientDashboard />{' '}
          </LoginRequired>
        }
      />
      <Route
        path='/dashboard'
        element={
          <LoginRequired>
            {' '}
            <DoctorDashboard />{' '}
          </LoginRequired>
        }
      />
      <Route path='/auth/signup' element={<SignupPage />} />
      <Route path='/auth/login' element={<LoginPage />} />
      <Route path='/auth/forgot' element={<ForgotPassword />} />
      <Route path='/auth/verify/:id' element={<VerificationStatus />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
