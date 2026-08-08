const MovieInteraction = require("../models/MovieInteraction");
const Movie = require("../models/Movie");
const { getMovieDetails } = require("../services/tmdbService");

const movieInteraction = async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    if (Number.isNaN(tmdbId)) {
      return res.status(400).json({
        message: "Invalid TMDB ID",
      });
    }

    const { movie, favorite, watchlist, watched } = req.body;

    const updates = {};

    if (favorite !== undefined) {
      if (typeof favorite !== "boolean") {
        return res.status(400).json({
          message: "favorite must be a boolean",
        });
      }
      updates.favorite = favorite;
    }

    if (watched !== undefined) {
      if (typeof watched !== "boolean") {
        return res.status(400).json({
          message: "watched must be a boolean",
        });
      }
      updates.watched = watched;
    }

    if (watchlist !== undefined) {
      if (typeof watchlist !== "boolean") {
        return res.status(400).json({
          message: "watchlist must be a boolean",
        });
      }
      updates.watchlist = watchlist;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "At least one interaction field is required",
      });
    }
    if (!movie) {
      return res.status(400).json({
        message: "Movie data is required.",
      });
    }
    let movieExist = await Movie.findOne({ tmdbId });

    if (!movieExist) {
      movieExist = await Movie.create({
        tmdbId,
        adult: movie.adult,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        genres: movie.genres,
        release_date: movie.release_date,
      });
    }

    const interaction = await MovieInteraction.findOneAndUpdate(
      {
        userId: req.userId,
        tmdbId,
      },
      updates,
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    return res.status(200).json({
      message: "Interaction update successful",
      interaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getInteractionsByType = async (req, res) => {
  try {
    const { type, page } = req.query;
    const allowedTypes = ["favorite", "watched", "watchlist"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Only favorite, watched, watchlist Interaction type exists.",
      });
    }

    const interactions = await MovieInteraction.find(
      { userId: req.userId, [type]: true },
      { tmdbId: 1 },
    )
      .skip((page - 1) * 18)
      .limit(18);

    const tmdbIds = interactions.map((interaction) => {
      return interaction.tmdbId;
    });

    let movies = await Movie.find({ tmdbId: { $in: tmdbIds } });

    movies = movies.map((movie) => ({
      id: movie.tmdbId,
      title: movie.title,
      adult: movie.adult,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      popularity: movie.popularity,
      genres: movie.genres,
      release_date: movie.release_date,
    }));

    return res.status(200).json({
      message: "Movie Interaction for this type found",
      movies,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

const getMovieInteraction = async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    if (Number.isNaN(tmdbId)) {
      return res.status(400).json({
        message: "Invalid TMDB ID",
      });
    }

    const interactions = await MovieInteraction.findOne(
      { userId: req.userId, tmdbId },
      { favorite: 1, watched: 1, watchlist: 1 },
    );

    return res.status(200).json({
      interactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

module.exports = {
  movieInteraction,
  getInteractionsByType,
  getMovieInteraction,
};
