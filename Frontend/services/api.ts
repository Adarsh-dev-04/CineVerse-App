const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,

  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
  sort_by = "popularity.desc",
  page = 1,
  genreId,
  year,
  rating,
  language,
}: {
  query: string;
  sort_by?: string;
  page?: number;
  genreId?: number | null;
  year?: number | null;
  rating?: number | null;
  language?: string | null;
}) => {
  let endpoint: string;

  // =========================
  // SEARCH
  // =========================

  if (query.trim()) {
    const params = new URLSearchParams({
      query: query.trim(),
      page: page.toString(),
    });
    params.append("include_adult","false");

    endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?${params}`;
  }

  // =========================
  // DISCOVER / FILTER
  // =========================
  else {
    const params = new URLSearchParams({
      sort_by,
      page: page.toString(),
    });

    // Genre
    if (genreId) {
      params.append("with_genres", genreId.toString());
    }

    // Release year
    if (year) {
      params.append("primary_release_year", year.toString());
    }

    // Minimum rating
    if (rating) {
      params.append("vote_average.gte", rating.toString());
    }
    params.append("include_adult","false");

    // Language
    if (language) {
      params.append("with_original_language", language);
    }

    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?${params}`;
  }

  // =========================
  // API REQUEST
  // =========================

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();

  // =========================
  // SEARCH RESULT RANKING
  // =========================

  if (query.trim()) {
    const q = query.trim().toLowerCase();

    return {
      ...data,

      results: [...data.results].sort((a, b) => {
        const aExact = a.title?.toLowerCase() === q;

        const bExact = b.title?.toLowerCase() === q;

        // Exact title first
        if (aExact !== bExact) {
          return bExact ? 1 : -1;
        }

        // Popularity
        if (b.popularity !== a.popularity) {
          return b.popularity - a.popularity;
        }

        // Vote count
        return b.vote_count - a.vote_count;
      }),
    };
  }

  return data;
};

export const fetchMovieDetails = async ({ movieId }: { movieId: string }) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchTrendingMovies = async () => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/trending/movie/week`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
  }

  const data = await response.json();
  return [...data.results].sort((a, b) => {
    if (b.popularity !== a.popularity) {
      return b.popularity - a.popularity;
    }

    return b.vote_average - a.vote_average;
  });
};
export const fetchNowPlayingMovies = async () => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/now_playing`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
  }

  const data = await response.json();
  return [...data.results].sort((a, b) => {
    if (b.popularity !== a.popularity) {
      return b.popularity - a.popularity;
    }

    return b.vote_average - a.vote_average;
  });
};

export const fetchTopRatedMovies = async () => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/top_rated`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch top rated movies: ${response.statusText}`);
  }

  const data = await response.json();

  return [...data.results].sort((a, b) => {
    if (b.popularity !== a.popularity) {
      return b.popularity - a.popularity;
    }

    return b.vote_average - a.vote_average;
  });
};

export const UpcomingMovies = async () => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/upcoming`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch upcoming movies: ${response.statusText}`);
  }

  const data = await response.json();

  return [...data.results]
    .filter((a) => {
      if (isAfterToday(a.release_date)) return a;
    })
    .sort((a, b) => {
      if (b.popularity !== a.popularity) {
        return b.popularity - a.popularity;
      }
      return b.vote_average - a.vote_average;
    });
};

export const fetchMovieVideos = async ({ movieId }: { movieId: string }) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie videos: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchMovieCredits = async ({ movieId }: { movieId: string }) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie credits: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchSimilarMovies = async ({ movieId }: { movieId: string }) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/similar`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch similar movies : ${response.statusText}`);
  }

  const data = await response.json();

  return data.results;
};

export const fetchMovieWatchProviders = async ({
  movieId,
}: {
  movieId: string;
}) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/watch/providers`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movie watch providers : ${response.statusText}`,
    );
  }

  const data = await response.json();

  return data.results;
};

function isAfterToday(releaseDate: any) {
  const r = new Date(releaseDate); // or parsed Date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  r.setHours(0, 0, 0, 0);
  return r.getTime() > today.getTime();
}

export const fetchGenreMovies = async ({
  id,
  page = 1,
  sort_by,
  language,
  year,
  rating,
}: {
  id: number;
  page: number;
  sort_by: string;
  language: string | null;
  year: number | null;
  rating: number | null;
}) => {
  const params = new URLSearchParams({
    with_genres: id.toString(),
    sort_by: sort_by,
    page: page.toString(),
  });


  // Release year
  if (year) {
    params.append("primary_release_year", year.toString());
  }

  // Minimum rating
  if (rating) {
    params.append("vote_average.gte", rating.toString());
  }

  // Language
  if (language) {
    params.append("with_original_language", language);
  }
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movie watch providers : ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
};

export async function getMoviesByGenre(genreId: number, page = 1) {
  const params = new URLSearchParams({
    with_genres: genreId.toString(),
    sort_by: "popularity.desc",
    page: page.toString(),
    language: "en-US",
  });

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}
