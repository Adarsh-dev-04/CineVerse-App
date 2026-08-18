const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure:false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"CineVerse" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your CineVerse Verification Code",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 0 auto;
        padding: 30px;
        background-color: #ffffff;
        color: #111111;
      ">
        <h1 style="margin-bottom: 10px;">
          Welcome to CineVerse 🎬
        </h1>

        <p>
          Use the verification code below to complete your registration.
        </p>

        <div style="
          margin: 30px 0;
          padding: 20px;
          background-color: #f4f4f5;
          border-radius: 10px;
          text-align: center;
        ">
          <span style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p>
          This code will expire in <strong>10 minutes</strong>.
        </p>

        <p style="color: #666666; font-size: 14px;">
          If you didn't try to create a CineVerse account,
          you can safely ignore this email.
        </p>

        <p style="margin-top: 30px;">
          — CineVerse Team
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log("OTP email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("[Gmail SMTP Error]:", error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
};