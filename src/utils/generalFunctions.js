// src/Functions/generalFunctions.js
const prisma = require('../config/prismaClient');

const getUserMember = async (userId) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                gender: true,
                auth_provider: true,
                user_roles: {
                    select: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        console.error('Error in getUserMember:', error);
        throw new Error(`Failed to get user member: ${error.message}`);
    }
};

module.exports = {
    getUserMember
};