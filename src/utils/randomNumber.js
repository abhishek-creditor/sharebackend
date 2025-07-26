function generateRandomOTP(length) {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10); // Random digit between 0 and 9
    }
    return otp;
  }

module.exports = generateRandomOTP