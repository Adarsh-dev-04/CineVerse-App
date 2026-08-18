const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

const sendOTPEmail = async (to, otp) => {
  try {
    const html = `
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
    `;

    const rawMessage = [
      `From: "CineVerse" <${process.env.GMAIL_USER}>`,
      `To: ${to}`,
      "Subject: Your CineVerse Verification Code",
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
    ].join("\r\n");

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("========== GMAIL API EMAIL SENT ==========");
    console.log("To:", to);
    console.log("From:", process.env.GMAIL_USER);
    console.log("Message ID:", response.data.id);
    console.log("==========================================");

    return response.data;
  } catch (error) {
    console.error("[Gmail API Error]:", error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
};