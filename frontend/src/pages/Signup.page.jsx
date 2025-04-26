import DoctorSignupForm from '../components/auth/Signup.component';
import Footer from '../components/partials/Footer.component';

export default function SignupPage () {
  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800 text-lg'>
      <DoctorSignupForm />
      <Footer />
    </div>
  );
}
