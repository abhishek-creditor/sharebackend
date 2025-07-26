// src/dao/Learner/LearnerDao.js
const prisma = require('../../config/prismaClient');

async function updateUserPassword(userId, hashedPassword) {
    try {
        return await prisma.users.update({
            where: { 
                id: userId 
            },
            data: { 
                password: hashedPassword,
                updated_at: new Date()
            },
            select: {
                id: true,
                updated_at: true
            }
        });
    } catch (error) {
        console.error('Error updating user password:', error);
        throw new Error(`Failed to update password: ${error.message}`);
    }
}

async function getUserById(userId) {
    try {
        return await prisma.users.findUnique({
            where: { 
                id: userId 
            },
            select: {
                id: true,
                email: true,
                password: true,
                first_name: true,
                last_name: true,
                auth_provider: true
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

module.exports = { 
    updateUserPassword,
    getUserById 
};