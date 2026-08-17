const mongoose = require("mongoose");

const PendingRegistrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    otpHash: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },
    resendAttempts: {
      type: Number,
      default: 0,
    },

    lastOTPsentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PendingRegistrationSchema.index(
  { otpExpiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const PendingRegistration = mongoose.model(
  "PendingRegistration",
  PendingRegistrationSchema,
);

module.exports = PendingRegistration;
