const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateToken,
  clearToken,
  verifyOTP,
  sendOTP,
  storeOTP,
  getOTP,
  deleteOTP,
} = require("../../helpers/auth/auth.function.js");
const {
  createUser,
  findByEmail,
  updatePassword,
  checkEmailOrPhone,
} = require("../../dao/auth/auth.js");
const crypto = require("crypto");

const { sendMail } = require('../../utils/mail.js');
const activityDao = require('../../dao/activity/activityDao.js');



const registerUser = async (req, res) => {
  try {
    const { email, phone } = req.body;
    console.log(new Date().toLocaleTimeString());    
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }


    // Check if user already exists
    const checkUser = await checkEmailOrPhone(email, phone);
    if (checkUser) {
      return res.status(400).json({
        message: `User already exists with email ${email} or phone ${phone}`,
      });
    }

    // Check if OTP already sent
    const storedOtp = await getOTP(email);
    if (storedOtp) {
      return res.status(400).json({
        message: `OTP already sent to ${email}, please verify`,
      });
    }

    // Generate secure OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    storeOTP(email, otp, 300); // 5 minutes TTL

    // Send OTP
    await sendMail(email,`OTP Verification`, `Your OTP for email verification is ${otp}` );

    res.status(201).json({
      success: true,
      message: `OTP sent to ${email}`,
    });
  } catch (error) {
    console.log(`Error on registration: `, error);
    if (error.name === "RedisError") {
      return res.status(500).json({ message: "Redis connection error", error });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, gender, dob, otp, auth_provider = "local", provider_id } = req.body;

    // Verify OTP only for local auth
    if (auth_provider === "local") {
      const verifyOptResponse = await verifyOTP(otp, email);
      if (!verifyOptResponse.success) {
        return res.status(400).json({ message: verifyOptResponse.message });
      }
      await deleteOTP(email);
    }

    // Handle password based on auth_provider
    const hashedPassword = auth_provider === "local" ? await bcrypt.hash(password, 10) : null;

    // Create user
    const newUser = await createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      gender,
      dob,
      auth_provider,
      provider_id: auth_provider === "google" ? provider_id : null,
    });

    // Generate token with roles
    const token = generateToken(res, { id: newUser.id, email: newUser.email });

    res.status(201).json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(`Error on verifying OTP: ${err.message}`);
    return res.status(500).json({ message: `Error on verifying OTP: ${err.message}` });
  }
};




const resendOtp = async (req, res) => {
  const { email } = req.body;

  const storedOtp = await getOTP(email);
  if (storedOtp) {
    return res.status(400).json({
      message: `OTP already sent to ${email}, please verify`,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900009).toString();
  await storeOTP(email, otp);
  await sendOTP(email, otp);

  console.log(`OTP sent to ${email}: ${otp}`);
  return res.status(201).json({ message: `otp sent at mail :- ${email}` });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await findByEmail(email);
    console.log('Existing user:', existingUser);

    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (existingUser.auth_provider === 'google') {
      return res.status(400).json({ message: 'Please use Google OAuth to login' });
    }

    const isCorrectPassword = await bcrypt.compare(password, existingUser.password || '');
    console.log('Password verification:', isCorrectPassword);
    if (!isCorrectPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(res, {
      id: existingUser.id,
      email: existingUser.email,
      first_name: existingUser.first_name,
      last_name: existingUser.last_name,
      phone: existingUser.phone,
      gender: existingUser.gender,
    });


    await activityDao.logActivity({
      userId: existingUser.id,
      action: 'USER_LOGIN',
      targetId: existingUser.id,
    });

    return res.status(200).json({
      success: true,
      token,
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error(`Error on login: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const logoutUser = async (req, res) => {
  try {
    clearToken(res);

    if (req.logout) {
      req.logout((err) => {
        if (err) {
          console.log(`Error logging out from pasport session`, err);
        }
      });
    }
    return res
      .status(200)
      .json({ message: "User logged out and token removed !" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate JWT token with expiration
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  res.json({ message: "Reset token generated", token: resetToken });
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req;
    const { password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    const updatedUser = await updatePassword(email, hashedPassword);

    if (!updatedUser) {
      return res.status(500).json({ message: "Error updating password" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
};