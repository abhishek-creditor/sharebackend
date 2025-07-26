const crypto = require('crypto');

// Generate a secure random token
const generateResetPasswordToken = () => {
  return crypto.randomBytes(32).toString('hex'); // Generates a 64-character hexadecimal string
};

module.exports = {
  generateResetPasswordToken,
};