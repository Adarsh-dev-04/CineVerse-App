const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
];

const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "credentials.json"
);

async function authorize() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  console.log("========== AUTH SUCCESS ==========");

  const tokens = auth.credentials;

  console.log("Access Token:", tokens.access_token);
  console.log("Refresh Token:", tokens.refresh_token);

  fs.writeFileSync(
    path.join(process.cwd(), "token.json"),
    JSON.stringify(tokens, null, 2)
  );

  console.log("token.json created successfully.");
}

authorize().catch((error) => {
  console.error("Authorization failed:");
  console.error(error);
});