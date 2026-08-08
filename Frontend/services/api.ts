const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,

  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();

  if (!query) return data.results;

  const q = query.toLowerCase();

  return [...data.results].sort((a, b) => {
    const aExact = a.title?.toLowerCase() === q;
    const bExact = b.title?.toLowerCase() === q;

    if (aExact !== bExact) {
      return bExact ? 1 : -1;
    }

    if (b.popularity !== a.popularity) {
      return b.popularity - a.popularity;
    }

    return b.vote_count - a.vote_count;
  });
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

export const fetchGenreMovies = async ({ id, page=1 }: { id: number, page:number }) => {
  const params = new URLSearchParams({
    with_genres: id.toString(),
    sort_by: "popularity.desc",
    page: page.toString(),
    language: "en-US",
  });
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params}`,
    {
      method:'GET',
      headers: TMDB_CONFIG.headers
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movie watch providers : ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.results;
};

export async function getMoviesByGenre(genreId : number, page = 1) {
  const params = new URLSearchParams({
    with_genres: genreId.toString(),
    sort_by: "popularity.desc",
    page: page.toString(),
    language: "en-US",
  });

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params}`,
    {
      method:'GET',
      headers: TMDB_CONFIG.headers
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}
