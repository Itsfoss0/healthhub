/**
 * Retrive profile information for the currently
 * authenticated user dynamically
 * @route: GET /api/version/profile
 * @access: Private (The authenticated user)
 * @auth: Bearer Token
 */

const Patient = require('../models/Patient.model');
const Doctor = require('../models/Doctor.model');

const getUserProfile = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'doctor') {
      user = await Doctor.findById(req.user.id).populate(
        'assignedPatients',
        'firstName lastName email phoneNumber'
      );
      if (!user) {
        return res.status(404).json({ error: 'user not found' });
      }
    } else if (req.user.role === 'patient') {
      user = await Patient.findById(req.user.id).populate([
        {
          path: 'assignedDoctors',
          select: 'firstName lastName email phoneNumber'
        },
        {
          path: 'programHistory.program',
          select: 'name type'
        }
      ]);
      if (!user) {
        return res.status(404).json({ error: 'user not found' });
      }
    } else {
      return res.status(404).json({ error: 'an error occurred' });
    }
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ error: 'an error occurred on the server' });
  }
};

module.exports = getUserProfile;
