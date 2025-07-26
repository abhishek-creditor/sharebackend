const jwt = require("jsonwebtoken");
const { findUserRoles } = require("../dao/auth/auth");
const redisClient = require("../config/redis");

// Midedleware to vaerify access token at the time of login
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token; // Fetch token from cookies

    if (!token) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Session expired. Please log in again." });
        }
        return res.status(403).json({ message: "Invalid token." });
    }
};


const accessTo = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Validate allowedRoles
      if (!allowedRoles.length) {
        return res.status(500).json({ message: 'Server error: No roles specified for access' });
      }

      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: Please log in' });
      }

      // Fetch user roles
      let roles = await redisClient.get(`user_roles_${req.user.id}`);

        if (!roles) {
            roles = await findUserRoles(req.user.id);
            redisClient.set(`user_roles_${req.user.id}`, JSON.stringify(roles), 'EX', 3600); 
            console.log(`User roles for ${req.user.id} cached successfully :  user_roles_${req.user.id}`);
        } else {
            roles =  JSON.parse(roles);
        }
        
      const userRoles = roles.map((r) => r.role);

      // Check if user has any allowed role
      const hasRole = allowedRoles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        return res.status(403).json({
          message: `Forbidden: Access restricted to ${allowedRoles.join(', ')} roles`,
        });
      }

      next();
    } catch (error) {
      console.error(`AccessTo middleware error: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
};


module.exports = { verifyToken, accessTo};