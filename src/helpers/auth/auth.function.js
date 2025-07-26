const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const redisClient = require("../../config/redis");


const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
  });

const sendOTP = async (email, otp, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject || `OTP Verification`,
    text: text || `Hello there \n Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };
    console.log(new Date().toLocaleTimeString());
    await transporter.sendMail(mailOptions);    
    console.log(new Date().toLocaleTimeString());
};

const clearToken = (res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, //will be changed to true in production with https
      sameSite: "Lax",
    });
};

const generateToken = (res, body) => {
  const expiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  const payload = {
    id: body.id,
    email: body.email
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    expires: expiresAt,
    // sameSite: "Lax",
    sameSite: "none",
  });
  return token;
};

const verifyResetToken = (req, res, next) => {
  const token = req.headers['reset-token']; // Get token from headers

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email = decoded.email; // Attach email to request
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const storeOTP = async (key, otp, ttl = 300) => {
  try {
    await redisClient.set(`otp:${key}`, otp, 'EX', ttl ); //redisClient.setex(`otp:${key}`, ttl, otp);
    console.log(`OTP stored for ${key}`);
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw error;
  }
};

const getOTP = async (key) => {
  try {
    return await redisClient.get(`otp:${key}`);
  } catch (error) {
    console.error("Error retrieving OTP:", error);
    throw error;
  }
};

const deleteOTP = async (key) => {
  try {
    await redisClient.del(`otp:${key}`);
    console.log(`OTP deleted for ${key}`);
  } catch (error) {
    console.error("Error deleting OTP:", error);
    throw error;
  }
};

const verifyOTP = async (otp, email) => {
  if (!otp) {
    return { success: false, message: "OTP is required" };
  }

  const storedOtp = await getOTP(email);
  if (!storedOtp) {
    return { success: false, message: "OTP expired or not found" };
  }

  if (String(storedOtp).trim() !== String(otp).trim()) {
    return { success: false, message: "Invalid OTP" };
  }

  return { success: true, message: "OTP verified successfully" };
};

module.exports = { sendOTP, clearToken, generateToken, verifyResetToken, storeOTP, getOTP, deleteOTP, verifyOTP };