export const mockDoctor = {
  id: 'd1',
  name: 'Dr. Jane Smith',
  specialization: 'Cardiologist',
  email: 'jane.smith@example.com',
  phone: '123-456-7890'
};

export const mockPatients = [
  {
    id: 'p1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    address: '123 Main St, Anytown, USA',
    createdAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 'p2',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-987-6543',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    address: '456 Oak Ave, Somewhere, USA',
    createdAt: '2023-02-20T10:15:00Z'
  },
  {
    id: 'p3',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '555-456-7890',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    address: '789 Pine St, Nowhere, USA',
    createdAt: '2023-03-05T14:45:00Z'
  }
];

export const mockPrograms = [
  {
    id: 'pr1',
    name: 'Cardiac Rehabilitation',
    description:
      'A comprehensive program designed to improve cardiovascular health after a heart attack or surgery.',
    startDate: '2023-04-01',
    endDate: '2023-06-30',
    capacity: 15,
    status: 'active',
    createdAt: '2023-03-15T09:00:00Z'
  },
  {
    id: 'pr2',
    name: 'Weight Management',
    description:
      'A structured program to help patients achieve and maintain a healthy weight through diet and exercise.',
    startDate: '2023-05-15',
    endDate: '2023-08-15',
    capacity: 20,
    status: 'active',
    createdAt: '2023-04-10T11:30:00Z'
  },
  {
    id: 'pr3',
    name: 'Diabetes Prevention',
    description:
      'Educational program focused on lifestyle changes to prevent or delay the onset of type 2 diabetes.',
    startDate: '2023-03-01',
    endDate: '2023-05-31',
    capacity: 12,
    status: 'completed',
    createdAt: '2023-02-15T13:45:00Z'
  }
];

export const upcomingAppointments = [
  {
    id: 1,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2025-05-15T10:30:00',
    location: 'Main Hospital, Room 305'
  },
  {
    id: 2,
    doctorName: 'Dr. Michael Chen',
    specialty: 'Physical Therapy',
    date: '2025-05-18T14:00:00',
    location: 'Rehabilitation Center'
  }
];

export const medicalRecords = [
  {
    id: 1,
    title: 'Annual Physical Examination',
    date: '2025-03-15T10:30:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'Examination',
    fileSize: '1.2 MB'
  },
  {
    id: 2,
    title: 'Blood Test Results',
    date: '2025-03-10T14:00:00',
    doctor: 'Dr. Michael Chen',
    type: 'Lab Results',
    fileSize: '850 KB'
  },
  {
    id: 3,
    title: 'X-Ray Report',
    date: '2025-02-28T09:15:00',
    doctor: 'Dr. Emily Wilson',
    type: 'Imaging',
    fileSize: '3.5 MB'
  },
  {
    id: 4,
    title: 'Cardiology Consultation',
    date: '2025-02-15T11:00:00',
    doctor: 'Dr. James Miller',
    type: 'Consultation',
    fileSize: '1.8 MB'
  },
  {
    id: 5,
    title: 'Prescription',
    date: '2025-02-10T16:30:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'Medication',
    fileSize: '500 KB'
  }
];

export const mockPatient = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Smith',
  dateOfBirth: '1990-01-01',
  gender: 'Female',
  phoneNumber: '(555) 111-2222',
  email: 'alice.smith@example.com',
  updatedPassword: true,
  address: '456 Elm St, Anytown, CA 54321',
  role: 'patient',
  emergencyContact: {
    name: 'Bob Smith',
    relationship: 'Husband',
    phoneNumber: '(555) 333-4444'
  },
  assignedDoctors: [
    {
      id: '101',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phoneNumber: '(555) 987-6543',
      specialty: 'Cardiology'
    },
    {
      id: '102',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      phoneNumber: '(555) 456-7890',
      specialty: 'Physical Therapy'
    },
    {
      id: '103',
      firstName: 'Emily',
      lastName: 'Wilson',
      email: 'emily.wilson@example.com',
      phoneNumber: '(555) 234-5678',
      specialty: 'Endocrinology'
    }
  ],
  programHistory: [
    {
      program: {
        id: '201',
        name: 'Cardiac Rehabilitation',
        description:
          'A comprehensive program to improve cardiovascular health after cardiac events.',
        type: 'outpatient',
        capacity: 15,
        startDate: '2025-01-15',
        endDate: '2025-04-15',
        isActive: true
      },
      admissionDate: '2025-01-15',
      dischargeDate: null,
      status: 'active'
    },
    {
      program: {
        id: '202',
        name: 'Diabetes Management',
        description:
          'A program to help patients manage their diabetes through diet, exercise, and medication.',
        type: 'outpatient',
        capacity: 20,
        startDate: '2024-10-01',
        endDate: '2025-01-01',
        isActive: false
      },
      admissionDate: '2024-10-01',
      dischargeDate: '2025-01-01',
      status: 'completed'
    },
    {
      program: {
        id: '203',
        name: 'Weight Management',
        description:
          'A program focused on healthy weight loss and maintenance through lifestyle changes.',
        type: 'outpatient',
        capacity: 25,
        startDate: '2025-06-01',
        endDate: '2025-09-01',
        isActive: true
      },
      admissionDate: '2025-06-01',
      dischargeDate: null,
      status: 'pending'
    }
  ],
  isActive: true,
  createdAt: '2024-01-01T10:00:00',
  updatedAt: '2025-03-15T14:30:00'
};
