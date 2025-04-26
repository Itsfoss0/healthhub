import React, { useState, useEffect } from 'react';
import {
  Activity,
  User,
  Calendar,
  UserPlus,
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronRight
} from 'lucide-react';
import patientService from '../../services/patientService.service';
import doctorService from '../../services/doctorServices.service';
import programService from '../../services/programService.service';
import useAuth from '../../hooks/authHook.hook';

const DoctorDashboard = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const auth = user.accessToken;
  const doctorId = user.user.id;
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePrograms: 0,
    completedPrograms: 0,
    upcomingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [showAddProgramForm, setShowAddProgramForm] = useState(false);
  const [patientFormData, setPatientFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  });
  const [programFormData, setProgramFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    capacity: 0,
    status: 'active'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const doctorResponse = await doctorService.getDoctorById(
          doctorId,
          auth
        );
        if (doctorResponse.status === 200) {
          setDoctor(doctorResponse.data);
        } else {
          throw new Error('Failed to fetch doctor data');
        }

        const patientsResponse = await patientService.getAllPatients(auth);
        if (patientsResponse.status === 200) {
          setPatients(patientsResponse.data);
          setStats((prevStats) => ({
            ...prevStats,
            totalPatients: patientsResponse.data.length
          }));
        } else {
          throw new Error('Failed to fetch patients data');
        }

        const programsResponse = await programService.getAllPrograms(auth);
        if (programsResponse.status === 200) {
          setPrograms(programsResponse.data);

          const activePrograms = programsResponse.data.filter(
            (program) => program.status === 'active'
          ).length;
          const completedPrograms = programsResponse.data.filter(
            (program) => program.status === 'completed'
          ).length;

          setStats((prevStats) => ({
            ...prevStats,
            activePrograms,
            completedPrograms
          }));
        } else {
          throw new Error('Failed to fetch programs data');
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth, doctorId]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await patientService.addPatient(patientFormData, auth);
      if (response.status === 201) {
        setPatients([...patients, response.data]);
        setStats((prevStats) => ({
          ...prevStats,
          totalPatients: prevStats.totalPatients + 1
        }));
        setShowAddPatientForm(false);
        setPatientFormData({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: ''
        });
      } else {
        throw new Error('Failed to add patient');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while adding patient');
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    try {
      const response = await programService.addNewProgram(
        programFormData,
        auth
      );
      if (response.status === 201) {
        setPrograms([...programs, response.data]);
        setStats((prevStats) => ({
          ...prevStats,
          activePrograms: prevStats.activePrograms + 1
        }));
        setShowAddProgramForm(false);
        setProgramFormData({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          capacity: 0,
          status: 'active'
        });
      } else {
        throw new Error('Failed to add program');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while adding program');
    }
  };

  const handlePatientDelete = async (patientId) => {
    try {
      const response = await patientService.deletePatient(patientId, auth);
      if (response.status === 200) {
        setPatients(patients.filter((patient) => patient.id !== patientId));
        setStats((prevStats) => ({
          ...prevStats,
          totalPatients: prevStats.totalPatients - 1
        }));
      } else {
        throw new Error('Failed to delete patient');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting patient');
    }
  };

  const handleProgramDelete = async (programId) => {
    try {
      const response = await programService.deleteProgram(programId, auth);
      if (response.status === 200) {
        const deletedProgram = programs.find(
          (program) => program._id === programId
        );
        setPrograms(programs.filter((program) => program._id !== programId));

        if (deletedProgram.status === 'active') {
          setStats((prevStats) => ({
            ...prevStats,
            activePrograms: prevStats.activePrograms - 1
          }));
        } else if (deletedProgram.status === 'completed') {
          setStats((prevStats) => ({
            ...prevStats,
            completedPrograms: prevStats.completedPrograms - 1
          }));
        }
      } else {
        throw new Error('Failed to delete program');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting program');
    }
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setPatientFormData({
      ...patientFormData,
      [name]: value
    });
  };

  const handleProgramInputChange = (e) => {
    const { name, value } = e.target;
    setProgramFormData({
      ...programFormData,
      [name]: value
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-xl font-semibold'>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-red-600 text-xl font-semibold'>{error}</div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Doctor Dashboard
            </h1>
            {doctor && (
              <div className='flex items-center space-x-2'>
                <div className='bg-blue-100 p-2 rounded-full'>
                  <User className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {doctor.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {doctor.specialization}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Tabs */}
        <div className='flex border-b border-gray-200 mb-6'>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'patients'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('patients')}
          >
            Patients
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'programs'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('programs')}
          >
            Programs
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {/* Stat Cards */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <div className='flex items-center'>
                    <div className='bg-blue-100 p-3 rounded-full'>
                      <Users className='h-6 w-6 text-blue-600' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-500'>
                        Total Patients
                      </p>
                      <p className='text-2xl font-semibold text-gray-900'>
                        {stats.totalPatients}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6'>
                  <div className='flex items-center'>
                    <div className='bg-green-100 p-3 rounded-full'>
                      <Activity className='h-6 w-6 text-green-600' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-500'>
                        Active Programs
                      </p>
                      <p className='text-2xl font-semibold text-gray-900'>
                        {stats.activePrograms}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6'>
                  <div className='flex items-center'>
                    <div className='bg-purple-100 p-3 rounded-full'>
                      <Calendar className='h-6 w-6 text-purple-600' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-500'>
                        Completed Programs
                      </p>
                      <p className='text-2xl font-semibold text-gray-900'>
                        {stats.completedPrograms}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6'>
                  <div className='flex items-center'>
                    <div className='bg-yellow-100 p-3 rounded-full'>
                      <Calendar className='h-6 w-6 text-yellow-600' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-500'>
                        Recent Activities
                      </p>
                      <p className='text-2xl font-semibold text-gray-900'>
                        {patients.length + programs.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Recent Patients */}
                <div className='bg-white rounded-lg shadow'>
                  <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
                    <h2 className='text-lg font-medium text-gray-900'>
                      Recent Patients
                    </h2>
                    <button
                      className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'
                      onClick={() => setActiveTab('patients')}
                    >
                      View all <ChevronRight className='h-4 w-4 ml-1' />
                    </button>
                  </div>
                  <div className='divide-y divide-gray-200'>
                    {patients.slice(0, 5).map((patient) => (
                      <div
                        key={patient._id}
                        className='px-6 py-4 flex justify-between items-center'
                      >
                        <div>
                          <p className='font-medium text-gray-900'>
                            {patient.name}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {patient.email}
                          </p>
                        </div>
                        <div className='text-sm text-gray-500'>
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {patients.length === 0 && (
                      <div className='px-6 py-4 text-gray-500 text-center'>
                        No patients found
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Programs */}
                <div className='bg-white rounded-lg shadow'>
                  <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
                    <h2 className='text-lg font-medium text-gray-900'>
                      Active Programs
                    </h2>
                    <button
                      className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'
                      onClick={() => setActiveTab('programs')}
                    >
                      View all <ChevronRight className='h-4 w-4 ml-1' />
                    </button>
                  </div>
                  <div className='divide-y divide-gray-200'>
                    {programs
                      .filter((program) => program.status === 'active')
                      .slice(0, 5)
                      .map((program) => (
                        <div key={program._id} className='px-6 py-4'>
                          <div className='flex justify-between items-center'>
                            <p className='font-medium text-gray-900'>
                              {program.name}
                            </p>
                            <span className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                              Active
                            </span>
                          </div>
                          <p className='text-sm text-gray-500 mt-1'>
                            {program.description}
                          </p>
                          <div className='flex justify-between text-xs text-gray-500 mt-2'>
                            <span>
                              Start:{' '}
                              {new Date(program.startDate).toLocaleDateString()}
                            </span>
                            <span>
                              End:{' '}
                              {new Date(program.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    {programs.filter((program) => program.status === 'active')
                      .length === 0 && (
                        <div className='px-6 py-4 text-gray-500 text-center'>
                          No active programs found
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Patients Management
                </h2>
                <button
                  className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center'
                  onClick={() => setShowAddPatientForm(true)}
                >
                  <UserPlus className='h-4 w-4 mr-2' />
                  Add New Patient
                </button>
              </div>

              {showAddPatientForm && (
                <div className='bg-white rounded-lg shadow mb-6 p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Add New Patient
                  </h3>
                  <form onSubmit={handleAddPatient}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Full Name
                        </label>
                        <input
                          type='text'
                          name='name'
                          value={patientFormData.name}
                          onChange={handlePatientInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Email
                        </label>
                        <input
                          type='email'
                          name='email'
                          value={patientFormData.email}
                          onChange={handlePatientInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Phone
                        </label>
                        <input
                          type='tel'
                          name='phone'
                          value={patientFormData.phone}
                          onChange={handlePatientInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Date of Birth
                        </label>
                        <input
                          type='date'
                          name='dateOfBirth'
                          value={patientFormData.dateOfBirth}
                          onChange={handlePatientInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Gender
                        </label>
                        <select
                          name='gender'
                          value={patientFormData.gender}
                          onChange={handlePatientInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        >
                          <option value=''>Select Gender</option>
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                          <option value='other'>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Address
                        </label>
                        <input
                          type='text'
                          name='address'
                          value={patientFormData.address}
                          onChange={handlePatientInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                    </div>
                    <div className='mt-6 flex justify-end space-x-3'>
                      <button
                        type='button'
                        className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                        onClick={() => setShowAddPatientForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium'
                      >
                        Add Patient
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className='bg-white shadow overflow-hidden rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Patient Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Phone
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date of Birth
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Gender
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {patients.map((patient) => (
                      <tr key={patient._id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {patient.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {patient.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {patient.phone}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize'>
                          {patient.gender}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex justify-end space-x-2'>
                            <button
                              className='text-blue-600 hover:text-blue-900'
                              onClick={() => setSelectedPatient(patient)}
                            >
                              <Edit className='h-5 w-5' />
                            </button>
                            <button
                              className='text-red-600 hover:text-red-900'
                              onClick={() => handlePatientDelete(patient._id)}
                            >
                              <Trash2 className='h-5 w-5' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {patients.length === 0 && (
                      <tr>
                        <td
                          colSpan='6'
                          className='px-6 py-4 text-center text-gray-500'
                        >
                          No patients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Programs Management
                </h2>
                <button
                  className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center'
                  onClick={() => setShowAddProgramForm(true)}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Add New Program
                </button>
              </div>

              {showAddProgramForm && (
                <div className='bg-white rounded-lg shadow mb-6 p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Add New Program
                  </h3>
                  <form onSubmit={handleAddProgram}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Program Name
                        </label>
                        <input
                          type='text'
                          name='name'
                          value={programFormData.name}
                          onChange={handleProgramInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Status
                        </label>
                        <select
                          name='status'
                          value={programFormData.status}
                          onChange={handleProgramInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        >
                          <option value='active'>Active</option>
                          <option value='pending'>Pending</option>
                          <option value='completed'>Completed</option>
                        </select>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Description
                        </label>
                        <textarea
                          name='description'
                          value={programFormData.description}
                          onChange={handleProgramInputChange}
                          rows='3'
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Start Date
                        </label>
                        <input
                          type='date'
                          name='startDate'
                          value={programFormData.startDate}
                          onChange={handleProgramInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          End Date
                        </label>
                        <input
                          type='date'
                          name='endDate'
                          value={programFormData.endDate}
                          onChange={handleProgramInputChange}
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Capacity
                        </label>
                        <input
                          type='number'
                          name='capacity'
                          value={programFormData.capacity}
                          onChange={handleProgramInputChange}
                          min='1'
                          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                    </div>
                    <div className='mt-6 flex justify-end space-x-3'>
                      <button
                        type='button'
                        className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                        onClick={() => setShowAddProgramForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium'
                      >
                        Add Program
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className='bg-white shadow overflow-hidden rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Program Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Description
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Duration
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Capacity
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {programs.map((program) => (
                      <tr key={program._id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {program.name}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                          {program.description}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(program.startDate).toLocaleDateString()} -{' '}
                          {new Date(program.endDate).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              program.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : program.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {program.status.charAt(0).toUpperCase() +
                              program.status.slice(1)}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {program.capacity}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex justify-end space-x-2'>
                            <button
                              className='text-blue-600 hover:text-blue-900'
                              onClick={() => setSelectedProgram(program)}
                            >
                              <Edit className='h-5 w-5' />
                            </button>
                            <button
                              className='text-red-600 hover:text-red-900'
                              onClick={() => handleProgramDelete(program._id)}
                            >
                              <Trash2 className='h-5 w-5' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {programs.length === 0 && (
                      <tr>
                        <td
                          colSpan='6'
                          className='px-6 py-4 text-center text-gray-500'
                        >
                          No programs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Patient Modal */}
      {selectedPatient && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-md w-full'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>
                Edit Patient
              </h3>
            </div>
            <div className='p-6'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updatePatient = async () => {
                    try {
                      const response =
                        await patientService.updatePatientDetails(
                          selectedPatient._id,
                          selectedPatient,
                          auth
                        );
                      if (response.status === 200) {
                        setPatients(
                          patients.map((p) =>
                            p._id === selectedPatient._id ? response.data : p
                          )
                        );
                        setSelectedPatient(null);
                      } else {
                        throw new Error('Failed to update patient');
                      }
                    } catch (err) {
                      setError(
                        err.message ||
                          'An error occurred while updating patient'
                      );
                    }
                  };
                  updatePatient();
                }}
              >
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      value={selectedPatient.name}
                      onChange={(e) =>
                        setSelectedPatient({
                          ...selectedPatient,
                          name: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email
                    </label>
                    <input
                      type='email'
                      value={selectedPatient.email}
                      onChange={(e) =>
                        setSelectedPatient({
                          ...selectedPatient,
                          email: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      value={selectedPatient.phone}
                      onChange={(e) =>
                        setSelectedPatient({
                          ...selectedPatient,
                          phone: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Date of Birth
                    </label>
                    <input
                      type='date'
                      value={
                        selectedPatient.dateOfBirth
                          ? new Date(selectedPatient.dateOfBirth)
                            .toISOString()
                            .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setSelectedPatient({
                          ...selectedPatient,
                          dateOfBirth: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Gender
                    </label>
                    <select
                      value={selectedPatient.gender}
                      onChange={(e) =>
                        setSelectedPatient({
                          ...selectedPatient,
                          gender: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    >
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Address
                    </label>
                    <input
                      type='text'
                      value={selectedPatient.address}
                      onChange={(e) =>
                        setSelectedPatient({
                          ...selectedPatient,
                          address: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>
                <div className='mt-6 flex justify-end space-x-3'>
                  <button
                    type='button'
                    className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                    onClick={() => setSelectedPatient(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium'
                  >
                    Update Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {selectedProgram && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-md w-full'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>
                Edit Program
              </h3>
            </div>
            <div className='p-6'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updateProgram = async () => {
                    try {
                      const response =
                        await programService.updateProgramDetails(
                          selectedProgram._id,
                          selectedProgram,
                          auth
                        );
                      if (response.status === 200) {
                        setPrograms(
                          programs.map((p) =>
                            p._id === selectedProgram._id ? response.data : p
                          )
                        );

                        // Update stats if status changed
                        const oldProgram = programs.find(
                          (p) => p._id === selectedProgram._id
                        );
                        if (oldProgram.status !== selectedProgram.status) {
                          if (oldProgram.status === 'active') {
                            setStats((prevStats) => ({
                              ...prevStats,
                              activePrograms: prevStats.activePrograms - 1
                            }));
                          } else if (oldProgram.status === 'completed') {
                            setStats((prevStats) => ({
                              ...prevStats,
                              completedPrograms:
                                prevStats.completedPrograms - 1
                            }));
                          }

                          if (selectedProgram.status === 'active') {
                            setStats((prevStats) => ({
                              ...prevStats,
                              activePrograms: prevStats.activePrograms + 1
                            }));
                          } else if (selectedProgram.status === 'completed') {
                            setStats((prevStats) => ({
                              ...prevStats,
                              completedPrograms:
                                prevStats.completedPrograms + 1
                            }));
                          }
                        }

                        setSelectedProgram(null);
                      } else {
                        throw new Error('Failed to update program');
                      }
                    } catch (err) {
                      setError(
                        err.message ||
                          'An error occurred while updating program'
                      );
                    }
                  };
                  updateProgram();
                }}
              >
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Program Name
                    </label>
                    <input
                      type='text'
                      value={selectedProgram.name}
                      onChange={(e) =>
                        setSelectedProgram({
                          ...selectedProgram,
                          name: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Status
                    </label>
                    <select
                      value={selectedProgram.status}
                      onChange={(e) =>
                        setSelectedProgram({
                          ...selectedProgram,
                          status: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    >
                      <option value='active'>Active</option>
                      <option value='pending'>Pending</option>
                      <option value='completed'>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      value={selectedProgram.description}
                      onChange={(e) =>
                        setSelectedProgram({
                          ...selectedProgram,
                          description: e.target.value
                        })}
                      rows='3'
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Start Date
                    </label>
                    <input
                      type='date'
                      value={
                        selectedProgram.startDate
                          ? new Date(selectedProgram.startDate)
                            .toISOString()
                            .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setSelectedProgram({
                          ...selectedProgram,
                          startDate: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      End Date
                    </label>
                    <input
                      type='date'
                      value={
                        selectedProgram.endDate
                          ? new Date(selectedProgram.endDate)
                            .toISOString()
                            .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setSelectedProgram({
                          ...selectedProgram,
                          endDate: e.target.value
                        })}
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Capacity
                    </label>
                    <input
                      type='number'
                      value={selectedProgram.capacity}
                      onChange={(e) =>
                        setSelectedProgram({
                          ...selectedProgram,
                          capacity: e.target.value
                        })}
                      min='1'
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>
                <div className='mt-6 flex justify-end space-x-3'>
                  <button
                    type='button'
                    className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                    onClick={() => setSelectedProgram(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium'
                  >
                    Update Program
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {error && (
        <div className='fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md'>
          <div className='flex'>
            <div className='py-1'>
              <svg
                className='h-6 w-6 text-red-500 mr-4'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <div>
              <p className='font-bold'>Error</p>
              <p className='text-sm'>{error}</p>
            </div>
            <div className='ml-auto'>
              <button
                className='text-red-500 hover:text-red-700'
                onClick={() => setError(null)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
