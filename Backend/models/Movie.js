const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },
    adult: {
      type: Boolean,
    },
    title: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      default: null,
    },
    vote_average: {
      type: Number,
      default: null,
    },
    popularity: {
      type: Number,
    },
    genres: [
      {
        id: Number,
        name: String,
      },
    ],

    release_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
