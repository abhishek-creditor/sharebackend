const jwt = require("jsonwebtoken");
const config = require('../config/config');

const createUserSession = async function (user) {
  const token = await generateJWT(user);
  const loginResponse = { sessionToken: token, user: user };
  return loginResponse;
};

const generateJWT = async function (tokenData) {
  return jwt.sign(tokenData, config.JWT_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRATION_MINUTES });
};

module.exports = {
  createUserSession,
  generateJWT
};
