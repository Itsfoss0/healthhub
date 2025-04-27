const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Program name is required']
    },
    description: {
      type: String,
      required: [true, 'Program description is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Program type is required'],
      enum: ['inpatient', 'outpatient', 'specialized', 'other']
    },
    capacity: {
      type: Number,
      default: null
    },
    startDate: {
      type: Date,
      required: [true, 'Program start date is required']
    },
    endDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    participants: [
      {
        patient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Patient'
        },
        admissionDate: {
          type: Date,
          default: Date.now
        },
        dischargeDate: {
          type: Date,
          default: null
        },
        status: {
          type: String,
          enum: ['active', 'completed', 'withdrawn', 'on-hold'],
          default: 'active'
        },
        notes: String
      }
    ]
  },
  {
    timestamps: true
  }
);

/*
 * transform the document to be frontend
 * friendly by changing _id to id and removing
 * the versioning field (__v)
 */

programSchema.set('toJSON', {
  transform: (doc, returnedDoc) => {
    if (returnedDoc._id) {
      returnedDoc.id = returnedDoc._id.toString();
      delete returnedDoc._id;
    }

    delete returnedDoc.__v;
  }
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
