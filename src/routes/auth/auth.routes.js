const express = require("express");
const router = express.Router();
const passport = require("passport");
// const { verifyToken } = require("../../../middleware/authMiddleware");
const {
    registerUser,
    verifyOtp,
    logoutUser,
    loginUser,
    forgotPassword,
    resetPassword,
    resendOtp,
} = require("../../controllers/auth/auth.controller");
const { generateToken, verifyResetToken } = require("../../helpers/auth/auth.function");


router.post("/registerUser", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err || !user) {
      return res.redirect("http://localhost:3000/auth?mode=login");
    }
    generateToken(res, user);
    return res.redirect("http://localhost:3000/home");
  })(req, res, next);
});

router.get("/check", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true, // Changed from msg to success
            user: req.user,
            message: "User login success", // Renamed msg to message for consistency
        });
    } else {
        res.status(401).json({
            success: false, // Added success: false for consistency
            message: "Unauthorized",
        });
    }
});

module.exports = router;