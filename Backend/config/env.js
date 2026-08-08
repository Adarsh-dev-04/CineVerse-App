require("dotenv").config();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "TMDB_ACCESS_TOKEN",
];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
}