const userProfileDao = require('../../dao/user/userProfile');
const { findUserById } = require('../../dao/auth/auth');
const { sendOTP, storeOTP, verifyOTP, deleteOTP } = require('../../helpers/auth/auth.function');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const cloudinary = require('../../config/cloudinaryConfig');
const messages = require('../../utils/messages');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return errorResponse(req, res, 404, messages.USER_NOT_FOUND);
    }

    return successResponse(req, res, user, 200, messages.PROFILE_FETCH);
  } catch (error) {
    return errorResponse(req, res, 500, `Error fetching user profile: ${error.message}`);
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, location, bio } = req.body;

    // Check if user exists
    const userExist = await findUserById(userId);
    if (!userExist) {
      return errorResponse(req, res, 404, messages.USER_NOT_FOUND);
    }

    // Create updates object with only provided fields
    const updates = {};
    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;
    if (phone) updates.phone = phone;
    if (location) updates.location = location;
    if (bio) updates.bio = bio;

    // Check if any fields were provided for update
    if (Object.keys(updates).length === 0) {
      return errorResponse(req, res, 400, messages.FIELD_REQUIRED);
    }

    const updatedUser = await userProfileDao.userProfileUpdate(userId, updates);
    return successResponse(req, res, updatedUser, 200, messages.PROFILE_UPDATED_SUCCESSFULLY);

  } catch (error) {

    return errorResponse(req, res, 500, `Error updating user profile: ${error.message}`);
  }
};

// Initiate email update
const emailUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newEmail } = req.body;

    if (!newEmail) {
      return errorResponse(req, res, 400, messages.NEW_EMAIL_REQUIRED);
    }

    // Check if user exists
    const userExist = await findUserById(userId);
    if (!userExist) {
      return errorResponse(req, res, 404, messages.USER_NOT_FOUND);
    }

    // Check if new email is different from current email
    if (userExist.email === newEmail) {
      return errorResponse(req, res, 400, messages.NEW_EMAIL_IS_SAME_AS_CURRENT_EMAIL);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await storeOTP(newEmail, otp);
    await sendOTP(newEmail, otp, 'Email Update Verification', `Your OTP for email update verification is: ${otp}`);

    return successResponse(req, res, null, 200, `OTP sent to ${newEmail}`);

  } catch (error) {
    console.error('Email update initiation error:', error);
    return errorResponse(req, res, 500, `Failed to initiate email update: ${error.message}`);
  }
};

// Verify and update email
const verifyEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newEmail, otp } = req.body;

    if (!newEmail || !otp) {
      return errorResponse(req, res, 400, messages.NEW_EMAIL_AND_OTP_REQUIRED);
    }

    // Verify OTP
    const verifyResult = await verifyOTP(otp, newEmail);
    if (!verifyResult.success) {
      return errorResponse(req, res, 400, verifyResult.message);
    }

    // Update email
    const updatedUser = await userProfileDao.updateUserEmail(userId, newEmail);
    await deleteOTP(newEmail);

    return successResponse(req, res, updatedUser, 200, messages.EMAIL_UPDATED_SUCCESSFULLY);

  } catch (error) {
    console.error('Email update error:', error);
    return errorResponse(req, res, 500, `Failed to update email: ${error.message}`);
  }
};

// Update profile image
const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    let imageUrl;

    // Check if user exists
    const userExist = await findUserById(userId);
    if (!userExist) {
      return errorResponse(req, res, 404, messages.USER_NOT_FOUND);
    }

    // Handle file upload
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary URL from multer-storage-cloudinary
    } 
    // Handle URL update
    else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return errorResponse(req, res, 400, 'Please provide either a file or imageUrl');
    }

    // Delete old image if exists
    if (userExist.image) {
      const publicId = userExist.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Update user's image
    const updatedUser = await userProfileDao.updateProfileImage(userId, imageUrl);
    return successResponse(req, res, updatedUser, 200, 'Profile image updated successfully');

  } catch (error) {
    return errorResponse(req, res, 500, `Error updating profile image: ${error.message}`);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  emailUpdate,
  verifyEmail,
  updateProfileImage
};
