const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const hashOTP = require("../utils/hashOTP");
const { sendOTPEmail } = require("../utils/emailService");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();

    const otpHash = await hashOTP(otp);

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PendingRegistration.deleteOne({
      email: normalizedEmail,
    });

    const pendingRegistration = await PendingRegistration.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      avatar: avatar || "",
      otpHash,
      resendAttempts: 0,
      lastOTPsentAt: new Date(),
      otpExpiresAt,
    });

    try {
      await sendOTPEmail(normalizedEmail, otp);
      console.log("========== REGISTER RESPONSE ==========");
      console.log("OTP email sent successfully");
      console.log("Email:", normalizedEmail);
      console.log("About to return 200 response");
      console.log("=======================================");
    } catch (error) {
      await PendingRegistration.deleteOne({
        _id: pendingRegistration._id,
      });

      throw error;
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        message: "OTP and Email are required",
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        message: "OTP must be a 6-digit number",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pendingUser = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return res.status(404).json({
        message: "No pending registration found",
      });
    }

    if (pendingUser.otpExpiresAt < new Date()) {
      await PendingRegistration.deleteOne({
        _id: pendingUser._id,
      });

      return res.status(400).json({
        message: "OTP expired. Please request a new OTP.",
      });
    }

    const verification = await bcrypt.compare(otp, pendingUser.otpHash);

    if (!verification) {
      pendingUser.otpAttempts += 1;

      if (pendingUser.otpAttempts >= 5) {
        await PendingRegistration.deleteOne({
          _id: pendingUser._id,
        });

        return res.status(429).json({
          message:
            "Maximum OTP verification attempts reached. Please request a new OTP.",
        });
      }

      await pendingUser.save();

      return res.status(401).json({
        message: "Incorrect OTP",
        attemptsRemaining: 5 - pendingUser.otpAttempts,
      });
    }

    let newUser;

    try {
      newUser = await User.create({
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
        avatar: pendingUser.avatar,
      });
    } catch (error) {
      if (error.code === 11000) {
        await PendingRegistration.deleteOne({
          _id: pendingUser._id,
        });

        return res.status(409).json({
          message: "User with this email already exists",
        });
      }

      throw error;
    }

    const token = generateToken(newUser._id);

    try {
      await PendingRegistration.deleteOne({
        _id: pendingUser._id,
      });
    } catch (cleanupError) {
      console.error("Failed to delete pending registration:", cleanupError);
    }

    return res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pendingUser = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return res.status(404).json({
        message: "No pending registration found with this email",
      });
    }

    if (pendingUser.resendAttempts >= 3) {
      return res.status(429).json({
        message:
          "Maximum resend attempts reached. Please start registration again.",
      });
    }

    const cooldown = 60 * 1000;
    const currentTime = Date.now();

    if (
      pendingUser.lastOTPsentAt &&
      currentTime - pendingUser.lastOTPsentAt.getTime() < cooldown
    ) {
      const remainingTime = Math.ceil(
        (cooldown - (currentTime - pendingUser.lastOTPsentAt.getTime())) / 1000,
      );

      return res.status(429).json({
        message: `Please wait ${remainingTime} seconds before requesting a new OTP.`,
        retryAfter: remainingTime,
      });
    }

    const previousOTPHash = pendingUser.otpHash;
    const previousOTPExpiresAt = pendingUser.otpExpiresAt;
    const previousResendAttempts = pendingUser.resendAttempts;
    const previousLastOTPsentAt = pendingUser.lastOTPsentAt;
    const previousOTPAttempts = pendingUser.otpAttempts;

    const otp = generateOTP();

    const otpHash = await hashOTP(otp);

    pendingUser.otpHash = otpHash;
    pendingUser.otpAttempts = 0;
    pendingUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    pendingUser.lastOTPsentAt = new Date();
    pendingUser.resendAttempts += 1;

    await pendingUser.save();

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (error) {
      pendingUser.otpHash = previousOTPHash;
      pendingUser.otpExpiresAt = previousOTPExpiresAt;
      pendingUser.resendAttempts = previousResendAttempts;
      pendingUser.lastOTPsentAt = previousLastOTPsentAt;
      pendingUser.otpAttempts = previousOTPAttempts;

      await pendingUser.save();

      throw error;
    }
    return res.status(200).json({
      message: "OTP resent successfully",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are missing",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify) {
      return res.status(401).json({
        message: "Password Incorrect",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login Succesful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  resendOTP,
  loginUser,
  getMe,
};
