const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken")

const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password ) {
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

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      avatar
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
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

    const user = await User.findOne({email: normalizedEmail}).select("+password");

    if(!user){
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    const passwordVerify = await bcrypt.compare(password, user.password);

    if(!passwordVerify){
      return res.status(401).json({
        message: "Password Incorrect",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message:"Login Succesful",
      token: token,
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Internal Server Error",
    });
  }
};
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if(!user){
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
  loginUser,
  getMe,
};
