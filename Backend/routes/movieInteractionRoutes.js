const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {movieInteraction, getInteractionsByType, getMovieInteraction} = require ("../controllers/movieInteractionController")
const router = express.Router();

router.patch("/:tmdbId", protect, movieInteraction)

router.get("/", protect, getInteractionsByType)

router.get("/:tmdbId", protect, getMovieInteraction)

module.exports = router;

