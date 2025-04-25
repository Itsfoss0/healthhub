const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    verified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    phoneNumber: {
      type: String
    },
    role: {
      type: String,
      default: 'doctor'
    },
    assignedPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
      }
    ]
  },
  {
    timestamps: true
  }
);

/*
 * transform the document to remove
 * sentitive info (password hash)
 * and rename the _id field to id
 * Also, no one needs the version (__v) field
 */

doctorSchema.set('toJSON', {
  transform: (doc, returnedDoc) => {
    returnedDoc.id = returnedDoc._id.toString();
    delete returnedDoc._id;
    delete returnedDoc.__v;
    delete returnedDoc.passwordHash;
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
