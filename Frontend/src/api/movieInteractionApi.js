import api from "./client";
import { handleApiError } from "@/utils/handleApiError";

export const patchMovieInteraction = async ({
  movie,
  watched,
  favorite,
  watchlist,
}) => {
  try {
    console.log({
      movie,
      favorite,
      watchlist,
      watched,
    });
    const response = await api.patch(`/movie-interactions/${movie.id}`, {
      movie,
      watched,
      watchlist,
      favorite,
    });

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update movie interaction");
  }
};

export const getMovieInteractionByType = async ({ type, page }) => {
  try {
    const response = await api.get("/movie-interactions", {
      params: {
        type,
        page,
      },
    });
    return response;
  } catch (error) {
    handleApiError(error, "Failed to get movies of this interaction type");
  }
};
export const getMovieInteractions = async (tmdbId) => {
  try {
    const response = await api.get(`/movie-interactions/${tmdbId}`);

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to get interactions of this movie");
  }
};
