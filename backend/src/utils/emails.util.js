const { CLIENT_URL } = require('../config/env.config');

exports.emailData = {
  currentYear: new Date().getFullYear(),
  unsubscribeLink: `${CLIENT_URL}/unsubscribe`,
  privacyPolicyLink: `${CLIENT_URL}/about/privacy`,
  termsOfServiceLink: `${CLIENT_URL}/about/terms`
};
