import NavBar from '../components/partials/NavBar.component';
import DemoSection from '../components/sections/DemoSection.component';
import Footer from '../components/partials/Footer.component';

export default function DemoPage () {
  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800 text-lg'>
      <NavBar />
      <DemoSection />
      <Footer />
    </div>
  );
}
