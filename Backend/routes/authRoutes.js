const express = require('express');
const { registerUser, loginUser, getMe, verifyUser, resendOTP } = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/register", registerUser);

router.post("/verify-otp", verifyUser);

router.post("/resend-otp", resendOTP)

router.post("/login",loginUser);

router.get("/me", protect, getMe);


module.exports = router;