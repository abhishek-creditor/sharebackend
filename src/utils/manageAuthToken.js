const AuthToken = require("../models/auth_token");
// Example function to create a new auth token
const createAuthToken = async (userId, token) => {
  try {
    const authToken = new AuthToken({
      user_id: userId,
      token: token,
    });
    const savedAuthToken = await authToken.save();
    return savedAuthToken;
  } catch (error) {
    console.error("Error creating auth token:", error);
    throw error;
  }
};

const updateAuthToken = async (userId, newToken) => {
  try {
    // Find existing auth token for the user
    let authToken = await AuthToken.findOne({ user_id: userId });

    if (!authToken) {
      // If no existing token, create a new one
      authToken = new AuthToken({
        user_id: userId,
        token: newToken,
      });
    } else {
      // Update existing token
      authToken.token = newToken;
    }

    // Save or update the auth token
    const savedAuthToken = await authToken.save();
    return savedAuthToken;
  } catch (error) {
    console.error("Error updating auth token:", error);
    throw error;
  }
};

const getUserTokenByUserId = async function (userId) {
  try {
    const result = await AuthToken.findOne({ user_id: userId });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};


module.exports = {
  createAuthToken,
  updateAuthToken,
  getUserTokenByUserId
};
