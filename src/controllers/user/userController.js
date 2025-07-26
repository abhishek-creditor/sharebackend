
// src/controllers/User/UserController.js

const bcryptjs = require('bcryptjs');
const { updateUserPassword, getUserById } = require('../../dao/user/userDao');

// Utility imports
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const messages = require('../../utils/messages');

const updatePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new ApiError(400, messages.ALL_PASSWORD_FIELDS_REQUIRED);
        }

        if (newPassword.length < 8) {
            throw new ApiError(400, messages.PASSWORD_TOO_SHORT);
        }

        if (newPassword !== confirmPassword) {
            throw new ApiError(400, messages.PASSWORDS_DO_NOT_MATCH);
        }

        if (currentPassword === newPassword) {
            throw new ApiError(400, messages.SAME_AS_OLD_PASSWORD);
        }

        // Get user from DB
        const user = await getUserById(userId);
        if (!user) {
            throw new ApiError(404, messages.USER_NOT_FOUND);
        }

        if (user.auth_provider !== 'local') {
            throw new ApiError(400, messages.OAUTH_PASSWORD_CHANGE_NOT_ALLOWED);
        }

        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new ApiError(400, messages.INCORRECT_CURRENT_PASSWORD);
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 12);
        const updatedUser = await updateUserPassword(userId, hashedPassword);

        return successResponse(req, res, {
            updatedAt: updatedUser.updated_at,
        }, 200, messages.PASSWORD_CHANGED_SUCCESSFULLY);

    } catch (error) {
        next(error); // Global error handler will use ApiError
    }
};

module.exports = { updatePassword };

