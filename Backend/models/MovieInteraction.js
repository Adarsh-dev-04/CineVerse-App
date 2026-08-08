const mongoose = require("mongoose");

const MovieInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  tmdbId: {
    type: Number,
    required: true,
  },

  watched: {
    type: Boolean,
    default: false,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  watchlist: {
    type: Boolean,
    default: false,
  },
});

MovieInteractionSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const MovieInteraction = mongoose.model(
  "MovieInteraction",
  MovieInteractionSchema,
);

module.exports = MovieInteraction;
