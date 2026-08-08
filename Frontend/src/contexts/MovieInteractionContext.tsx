import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getMovieInteractionByType,
  patchMovieInteraction,
} from "@/api/movieInteractionApi";
import { useAuth } from "@/contexts/AuthContext";

export type CollectionType = "favorite" | "watchlist" | "watched";

export type MovieInteraction = {
  favorite: boolean;
  watchlist: boolean;
  watched: boolean;
};


type MovieInteractionContextType = {
  getCollection: (type: CollectionType) => any[];

  interactions: Record<number, MovieInteraction>;

  loading: boolean;

  refreshCollections: () => Promise<void>;

  toggleInteraction: (movie: Movie, type: CollectionType) => Promise<void>;

  getInteraction: (tmdbId: number) => MovieInteraction;
};

const MovieInteractionContext =
  createContext<MovieInteractionContextType | null>(null);

export const useMovieInteraction = () => {
  const context = useContext(MovieInteractionContext);

  if (!context) {
    throw new Error(
      "useMovieInteraction must be used inside MovieInteractionProvider",
    );
  }

  return context;
};

export function MovieInteractionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [movies, setMovies] = useState<Record<number, Movie>>({});

  const [interactions, setInteractions] = useState<
    Record<number, MovieInteraction>
  >({});

  const fetchCollection = async (type: CollectionType) => {
    const response = await getMovieInteractionByType({
      type,
      page: 1,
    });

    return response.data.movies ?? [];
  };

  const getInteraction = (tmdbId: number): MovieInteraction => {
    return (
      interactions[tmdbId] ?? {
        favorite: false,
        watchlist: false,
        watched: false,
      }
    );
  };

  const refreshCollections = async () => {
    if (!user) {
      setMovies({});
      setInteractions({});
      return;
    }

    try {
      setLoading(true);

      const [favorite, watchlist, watched] = await Promise.all([
        fetchCollection("favorite"),
        fetchCollection("watchlist"),
        fetchCollection("watched"),
      ]);

      const movieMap: Record<number, Movie> = {};

      [...favorite, ...watchlist, ...watched].forEach((movie) => {
        movieMap[movie.tmdbId] = movie;
      });

      setMovies(movieMap);

      const interactionMap: Record<number, MovieInteraction> = {};

      favorite.forEach((movie: any) => {
        interactionMap[movie.tmdbId] ??= {
          favorite: false,
          watchlist: false,
          watched: false,
        };

        interactionMap[movie.tmdbId].favorite = true;
      });

      watchlist.forEach((movie: any) => {
        interactionMap[movie.tmdbId] ??= {
          favorite: false,
          watchlist: false,
          watched: false,
        };

        interactionMap[movie.tmdbId].watchlist = true;
      });

      watched.forEach((movie: any) => {
        interactionMap[movie.tmdbId] ??= {
          favorite: false,
          watchlist: false,
          watched: false,
        };

        interactionMap[movie.tmdbId].watched = true;
      });

      setInteractions(interactionMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCollections();
  }, [user]);

  const toggleInteraction = async (movie: Movie, type: CollectionType) => {
    const current = getInteraction(movie.id);

    const updated = {
      favorite: current.favorite,
      watchlist: current.watchlist,
      watched: current.watched,
    };

    updated[type] = !updated[type];

    setInteractions((prev) => ({
      ...prev,
      [movie.id]: updated,
    }));

    try {
      const response = await patchMovieInteraction({
        movie,
        favorite: updated.favorite,
        watchlist: updated.watchlist,
        watched: updated.watched,
      });

      setInteractions((prev) => ({
        ...prev,
        //@ts-ignore
        [movie.id]: response.data.interaction,
      }));

      setMovies((prev) => ({
        ...prev,
        [movie.id]: movie,
      }));
    } catch (error) {
      // Rollback if API fails
      setInteractions((prev) => ({
        ...prev,
        [movie.id]: current,
      }));

      throw error;
    }
  };

  const getCollection = (type: CollectionType) =>
    Object.values(movies).filter(
      (movie) => interactions[movie.id]?.[type] === true,
    );

  return (
    <MovieInteractionContext.Provider
      value={{
        interactions,
        loading,
        refreshCollections,
        toggleInteraction,
        getInteraction,
        getCollection,
      }}
    >
      {children}
    </MovieInteractionContext.Provider>
  );
}
