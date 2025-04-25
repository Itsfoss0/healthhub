/**
 * Token model for JWT and
 * authentication functionalities.
 * Also used in password reset and account verification
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    refPath: 'userType',
    required: true
  },
  userType: {
    type: String,
    enum: ['Doctor', 'Patient']
  },
  token: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  },
  isValid: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

tokenSchema.set('toJSON', {
  transform: (doc, returnedDoc) => {
    returnedDoc.id = returnedDoc._id.toString();
    delete returnedDoc._id;
    delete returnedDoc.__v;
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
