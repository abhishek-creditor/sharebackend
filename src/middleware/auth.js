const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Basic authentication middleware
exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.users.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid authentication token' });
    }
};

// Admin authentication middleware
exports.adminAuth = async (req, res, next) => {
    try {
        await exports.auth(req, res, () => {
            // Check if user has admin role
            prisma.user_roles.findFirst({
                where: {
                    user_id: req.user.id,
                    role: 'ADMIN'
                }
            }).then(role => {
                if (!role) {
                    return res.status(403).json({ message: 'Admin access required' });
                }
                next();
            }).catch(error => {
                res.status(500).json({ message: 'Server error', error: error.message });
            });
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid authentication token' });
    }
};
