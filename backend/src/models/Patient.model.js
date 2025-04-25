const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    updatedPassword: {
      type: Boolean,
      default: false
    },
    passwordHash: {
      type: String,
      required: true
    },
    address: { type: String },
    role: { type: String, default: 'patient' },
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String
    },

    assignedDoctors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
      }
    ],

    programHistory: [
      {
        program: {
          type: Schema.Types.ObjectId,
          ref: 'Program'
        },
        admissionDate: Date,
        dischargeDate: Date,
        status: {
          type: String,
          enum: ['active', 'completed', 'withdrawn', 'pending'],
          default: 'pending'
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/*
 * transform the document to remove
 * sentitive info (password hash)
 * and rename the _id field to id
 * Also remove the version (__v) field
 */

patientSchema.set('toJSON', {
  transform: (doc, returnedDoc) => {
    returnedDoc.id = returnedDoc._id.toString();
    delete returnedDoc._id;
    delete returnedDoc.__v;
    delete returnedDoc.passwordHash;
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
