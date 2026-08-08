require("./config/env");

const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");

const healtRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const movieInteractionRoutes = require("./routes/movieInteractionRoutes");
const appReviewRoutes = require("./routes/appReviewRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/movie-interactions", movieInteractionRoutes);
app.use("/api/health", healtRoutes);
app.use("/api/app-review", appReviewRoutes);
app.get("/", (req, res) => {
  res.send("Movie API is running");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

app.use(errorHandler);
