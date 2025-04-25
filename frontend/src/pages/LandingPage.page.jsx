import Footer from '../components/partials/Footer.component';
import NavBar from '../components/partials/NavBar.component';
import FeatureSection from '../components/sections/FeaturesSections.component';
import HeroSection from '../components/sections/HeroSection.component';
import TestimonialSection from '../components/sections/TestimonialSections.component';

export default function HealthHubLandingPage () {
  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800 text-lg'>
      <NavBar />
      <HeroSection />
      <div className='max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-16'>
        <FeatureSection />
        <TestimonialSection />
      </div>
      <Footer />
    </div>
  );
}
