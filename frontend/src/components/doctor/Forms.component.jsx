import { useState } from 'react';
import Button from '../ui/Button.component';
import Input from '../ui/Input.component';
import { Textarea } from '../ui/TextArea.component';

export function PatientForm ({ patient, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    patient || {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      createdAt: new Date().toISOString()
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            First Name
          </label>
          <Input
            type='text'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Last Name
          </label>
          <Input
            type='text'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Email
          </label>
          <Input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Phone
          </label>
          <Input
            type='tel'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Date of Birth
          </label>
          <Input
            type='date'
            name='dateOfBirth'
            value={
              formData.dateOfBirth
                ? new Date(formData.dateOfBirth).toISOString().split('T')[0]
                : ''
            }
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Gender
          </label>
          <select
            name='gender'
            value={formData.gender}
            onChange={handleChange}
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
          <Input
            type='text'
            name='address'
            value={formData.address}
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>
      </div>
      <div className='mt-6 flex justify-end space-x-3'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
          {patient ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </form>
  );
}

export function ProgramForm ({ program, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    program || {
      id: '',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      capacity: 0,
      type: 'inpatient',
      createdAt: new Date().toISOString()
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' ? Number.parseInt(value) || 0 : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Program Name
          </label>
          <Input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Type
          </label>
          <select
            name='type'
            value={formData.status}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value='inpatient'>Inpatient</option>
            <option value='outpatient'>Outpatient</option>
            <option value='specialized'>Specialized</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Description
          </label>
          <Textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className='w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Start Date
          </label>
          <Input
            type='date'
            name='startDate'
            value={
              formData.startDate
                ? new Date(formData.startDate).toISOString().split('T')[0]
                : ''
            }
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            End Date
          </label>
          <Input
            type='date'
            name='endDate'
            value={
              formData.endDate
                ? new Date(formData.endDate).toISOString().split('T')[0]
                : ''
            }
            onChange={handleChange}
            className='w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Capacity
          </label>
          <Input
            type='number'
            name='capacity'
            value={formData.capacity}
            onChange={handleChange}
            min='1'
            className='w-full'
            required
          />
        </div>

      </div>
      <div className='mt-6 flex justify-end space-x-3'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
          {program ? 'Update Program' : 'Add Program'}
        </Button>
      </div>
    </form>
  );
}
