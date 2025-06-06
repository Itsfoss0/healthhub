import { useState } from 'react';
import Sidebar from './SideBar.component';
import MobileMenu from './MobileMenu.component';
import TopNavigation from './TopNavigation.component';
import DashboardOverview from './DashboardOverview.component';
import ProgramHistory from './ProgramHistory.component';
import AssignedDoctors from './AssignedDoctors.component';
import MedicalRecords from './MedicalRecords.component';
import ProfileSettings from './ProfileSettings.component';
import usePatientProfile from '../../hooks/patientProfile.hook';
import { Spinner } from '../ui/Spinner.component';
import FirstTimePasswordUpdate from '../auth/FirstTimePasswordUpdate.component';

export default function PatientDashboard () {
  const { patient, isLoading, error } = usePatientProfile();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    setShowEditProfileModal(false);
  };

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Spinner text='Loading profile, please wait' />
      </div>
    );
  }

  if (error) {
    return <div>An error occured when trying to load your profile</div>;
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar - Desktop */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Mobile Menu */}
      <MobileMenu
        activeMobileMenu={activeMobileMenu}
        setActiveMobileMenu={setActiveMobileMenu}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto'>
        {/* Top Navigation */}
        <TopNavigation activeSection={activeSection} patient={patient} />

        {/* Dashboard Overview */}
        {activeSection === 'overview' && (
          <DashboardOverview
            patient={patient}
            setActiveSection={setActiveSection}
          />
        )}

        {/* Program History */}
        {activeSection === 'programs' && (
          <ProgramHistory programHistory={patient.programHistory} />
        )}

        {/* Assigned Doctors */}
        {activeSection === 'doctors' && (
          <AssignedDoctors assignedDoctors={patient.assignedDoctors} />
        )}

        {/* Medical Records */}
        {activeSection === 'records' && <MedicalRecords />}

        {/* Profile Settings */}
        {activeSection === 'profile' && (
          <ProfileSettings
            patient={patient}
            showEditProfileModal={showEditProfileModal}
            setShowEditProfileModal={setShowEditProfileModal}
            handleEditProfile={handleEditProfile}
          />
        )}
      </main>
    </div>
  );
}
