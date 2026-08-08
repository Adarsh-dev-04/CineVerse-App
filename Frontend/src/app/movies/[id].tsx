import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import IonicIcons from "@expo/vector-icons/Ionicons";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { icons } from "../../../constants/icons";
import { formatCurrencyCompact } from "../../../lib/CurrencyFormater";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieVideos,
  fetchMovieWatchProviders,
  fetchSimilarMovies,
} from "../../../services/api";
import useFetch from "../../../services/useFetch";
import MovieCard from "@/components/common/MovieCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import {
  getMovieInteractions,
  patchMovieInteraction,
} from "@/api/movieInteractionApi";
import useAuth from "@/hooks/useAuth";

import { images } from "../../../constants/images";
import { useBottomSheet } from "@/contexts/BottomSheetContext";
import { useMovieInteraction } from "@/contexts/MovieInteractionContext";

const moviesDetail = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { width } = Dimensions.get("window");

  const playerWidth = width - 40;
  const playerHeight = (playerWidth * 9) / 16;

  const { showLoginSheet } = useBottomSheet();

  const insets = useSafeAreaInsets();

  const [readMore, setReadMore] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const movieId = Array.isArray(id) ? id[0] : id;
  const tmdbId = movieId ? Number(movieId) : NaN;

  const { getInteraction, toggleInteraction } = useMovieInteraction();

  const interaction = Number.isNaN(tmdbId)
    ? { favorite: false, watchlist: false, watched: false }
    : getInteraction(tmdbId);

  const scrollRef = useRef<ScrollView>(null);
  const trailerRef = useRef<View>(null);
  const trailerY = useRef(0);

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails({ movieId: movieId }), true);

  const {
    data: credits,
    loading: creditsLoading,
    error: creditsError,
  } = useFetch(() => fetchMovieCredits({ movieId: movieId }), true);

  const {
    data: Videos,
    loading: videosLoading,
    error: videosError,
  } = useFetch(() => fetchMovieVideos({ movieId: movieId }), true);

  const {
    data: similarMovies,
    loading: similarLoading,
    error: similarError,
  } = useFetch(() => fetchSimilarMovies({ movieId: movieId }), true);

  const {
    data: watchProviders,
    loading: watchProvidersLoading,
    error: watchProvidersError,
  } = useFetch(() => fetchMovieWatchProviders({ movieId: movieId }), true);
  const trailer = Videos?.results.find(
    (video: { site: string; type: string }) =>
      video.site === "YouTube" && video.type === "Trailer",
  );

  const groupedCrew = Object.values(
    (credits?.crew ?? []).reduce((acc: any, person: any) => {
      if (!acc[person.id]) {
        acc[person.id] = {
          ...person,
          jobs: [person.job],
        };
      } else {
        // Add the job only if it isn't already present
        if (!acc[person.id].jobs.includes(person.job)) {
          acc[person.id].jobs.push(person.job);
        }

        // Keep highest popularity if needed
        acc[person.id].popularity = Math.max(
          acc[person.id].popularity,
          person.popularity,
        );
      }

      return acc;
    }, {}),
  )
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .slice(0, 10);

  const key = trailer?.key;

  const Loading =
    loading ||
    creditsLoading ||
    videosLoading ||
    similarLoading ||
    watchProvidersLoading;
  const Error =
    error || creditsError || videosError || similarError || watchProvidersError;

  const providers = [
    ...(watchProviders?.IN?.flatrate ?? []),
    ...(watchProviders?.IN?.rent ?? []),
    ...(watchProviders?.IN?.buy ?? []),
  ];

  const uniqueProviders = providers.filter(
    (provider, index, self) =>
      index === self.findIndex((p) => p.provider_id === provider.provider_id),
  );

  const activeMovieId = movie?.id ?? tmdbId;


  return (
    <View className="flex-1 bg-primary">
      <BlurView
        intensity={100}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          zIndex: 100,
        }}
      ></BlurView>
      {Loading ? (
        <ActivityIndicator
          size="large"
          color="#0000FF"
          className="my-auto self-center"
        />
      ) : Error ? (
        <Text className="text-white">Error: {Error.message}</Text>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            scrollEnabled={true}
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ref={scrollRef}
          >
            {/* Movie Banner Section */}
            <ImageBackground
              source={{
                uri: `https://image.tmdb.org/t/p/w780${movie?.backdrop_path}`,
              }}
              resizeMode="cover"
              className="w-full h-80 relative mb-72"
            >
              <View className="absolute top-20 left-8 z-10 ">
                <TouchableOpacity
                  className="bg-black/50 rounded-full px-2 py-2"
                  onPress={() =>
                    user?
                    (movie && !Number.isNaN(activeMovieId)
                      ? toggleInteraction(movie, "favorite")
                      : undefined):showLoginSheet('favorite','heart')
                  }
                >
                  <IonicIcons
                    name={interaction.favorite ? "heart" : "heart-outline"}
                    size={25}
                    color={interaction.favorite ? "#EF4444" : "#FFFFFF"}
                  />
                </TouchableOpacity>

                {showMessage ? (
                  <View className="absolute top-36 left-8 z-10 bg-accent/80 rounded-full px-4 py-2">
                    <Text className="text-base text-white">{message}</Text>
                  </View>
                ) : (
                  ""
                )}
              </View>

              <View className="absolute top-36 left-8 z-10 flex-row gap-4">
                <TouchableOpacity
                  className={`${interaction.watched ? "bg-[#22C55E]" : "bg-black/50"} rounded-full px-2 py-2`}
                  onPress={() =>
                    user?
                    (movie && !Number.isNaN(activeMovieId)
                      ? toggleInteraction(movie, "watched")
                      : undefined): showLoginSheet("watched",'bookmark')
                  }
                >
                  <IonicIcons
                    name={interaction.watched ? "checkmark-done-circle" : "checkmark-done"}
                    size={25}
                    color={"#FFFFFF"}
                  />
                </TouchableOpacity>

                {showMessage ? (
                  <View className="z-10 bg-accent/80 color-gree rounded-full px-4 py-2">
                    <Text className="text-base text-white my-auto">
                      {message}
                    </Text>
                  </View>
                ) : (
                  ""
                )}
              </View>

              {/* Overlay Section */}
              <View className="w-full h-80 absolute top-0 bg-black/40 z-0"></View>

              {/* Movie Poster Section */}
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                }}
                className="w-[180px] h-[280px] absolute -bottom-60 left-5 rounded-lg border border-gray-500"
              />

              {/* Movie Title Section */}
              <Text className="text-white text-3xl font-semibold capitalize absolute -bottom-14 right-0 w-[180px]">
                {movie.title}
              </Text>

              {/* Movie Info Section */}
              <View className="absolute right-0 -bottom-36 flex items-start gap-4 w-[180px]">
                <View className="flex-row items-center">
                  <Text className="text-gray-200 text-base">
                    {movie.release_date?.split("-")[0]}{" "}
                  </Text>
                  {movie.adult === true && (
                    <Text className="text-gray-200 text-base">• A </Text>
                  )}
                  <Text className="text-gray-200 text-base">
                    • {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}
                    m{" "}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={icons.star} className="size-5" />
                  <Text className="text-gray-500 text-base">
                    {" "}
                    <Text className="text-white font-semibold mr-1 text-base">
                      {Math.round(movie.vote_average * 10) / 10}
                    </Text>
                    /10
                  </Text>
                  <Text className="text-gray-500 text-base ml-2">
                    {"("}
                    {movie.vote_count < 1000000
                      ? Math.round(movie.vote_count / 1000) + "K"
                      : Math.round(movie.vote_count / 1000000) + "M"}
                    {")"}
                  </Text>
                </View>
              </View>

              {/* Genres Section */}
              <View className="absolute -bottom-60 right-0 overflow-hidden w-[180]">
                <View className="flex-row flex-wrap gap-3">
                  {movie.genres.map((genre: { name: string }) => {
                    return (
                      <View
                        className="bg-slate-500/10 px-2 py-1 rounded-full border border-slate-200/20"
                        key={genre.name}
                      >
                        <Text className="text-gray-300 text-base">
                          {genre.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ImageBackground>

            {/* Watch Trailer and Save Button Section */}
            <View className="flex-row items-center justify-center mb-4 px-6 w-full">
              <TouchableOpacity
                className="flex-row items-start justify-center bg-accent border border-gray-500/70 w-1/2 rounded-xl overflow-hidden"
                onPress={() => {
                  scrollRef.current?.scrollTo({
                    y: trailerY.current,
                    animated: true,
                  });
                }}
              >
                <ImageBackground
                  source={images.highlight}
                  className="aboslute left-[-3] flex-row w-full h-auto items-center justify-center gap-2 py-3 px-2"
                  resizeMode="cover"
                >
                  <Text className="text-primary text-base font-semibold mr-2">
                    Watch Trailer
                  </Text>
                  <FontAwesome name="play" size={20} color="#151312" />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 py-3 rounded-xl ml-5 bg-slate-500/10 border border-gray-500/70 w-1/2"
                onPress={() =>
                  user?
                  (movie && !Number.isNaN(activeMovieId)
                    ? toggleInteraction(movie, "watchlist")
                    : undefined):showLoginSheet('watchlist','bookmark')
                }
              >
                <Text className="text-white text-base font-semibold mr-2">
                  {interaction.watchlist ? "Watchlisted" : "Add to watchlist"}
                </Text>
                <FontAwesome
                  name="bookmark"
                  size={20}
                  color={interaction.watchlist ? "#F59E0B" : "#FFFFFF"}
                />
              </TouchableOpacity>
            </View>

            {/* Movie Overview Section */}
            <View className="mb-8 px-5">
              <Text className="text-white text-xl font-bold mb-2">
                Overview
              </Text>
              <Text
                className="text-gray-400 text-base"
                numberOfLines={readMore ? undefined : 3}
              >
                {movie.overview}
              </Text>
              <TouchableWithoutFeedback onPress={() => setReadMore(!readMore)}>
                {readMore ? (
                  <View className="flex-row items-center gap-2">
                    <Text className="text-accent/90 text-base mt-1">
                      Read Less
                    </Text>
                    <FontAwesome name="chevron-up" size={10} color="#AB8BE1" />
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Text className="text-accent/90 text-base mt-1">
                      Read More
                    </Text>
                    <FontAwesome
                      name="chevron-down"
                      size={10}
                      color="#AB8BE1"
                    />
                  </View>
                )}
              </TouchableWithoutFeedback>
            </View>

            {/* Movie Details Section */}
            <View className="flex-col justify-center mb-8 mx-5 py-5 border border-gray-500/50 rounded-lg gap-4">
              <View className="flex-row items-center justify-between mb-2 ">
                <View className="w-1/3 flex items-start justify-start pl-4 gap-2 h-full">
                  <FontAwesome name="calendar" size={20} color="#FFFFFF" />
                  <Text className="text-gray-400 text-base">Release Date</Text>
                  <Text className="text-gray-300 text-base">
                    {new Date(movie.release_date)
                      .toDateString()
                      .replace(/^\S+\s/, "")}
                  </Text>
                </View>
                <View className="w-1/3 border-r border-l border-gray-500/50 flex items-start justify-start pl-6 gap-2 h-full">
                  <MaterialDesignIcons
                    name="account-cowboy-hat"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text className="text-gray-400 text-base">Director</Text>
                  <Text className="text-gray-300 text-base">
                    {
                      credits?.crew?.find(
                        (person: any) => person.job === "Director",
                      )?.name
                    }
                  </Text>
                </View>
                <View className="w-1/3 flex items-start justify-start h-full pl-6 gap-2">
                  <FontAwesome name="dollar" size={20} color="#FFFFFF" />
                  <Text className="text-gray-400 text-base">Budget</Text>
                  <Text className="text-gray-300 text-base">
                    {formatCurrencyCompact(movie.budget || 0)}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-1/3 flex items-start justify-start h-full pl-6 gap-2">
                  <FontAwesome name="line-chart" size={20} color="#FFFFFF" />
                  <Text className="text-gray-400 text-base">Revenue</Text>
                  <Text className="text-gray-300 text-base">
                    {formatCurrencyCompact(movie.revenue || 0)}
                  </Text>
                </View>
                <View className="w-1/3 border-r border-l border-gray-500/50 flex items-start justify-start pl-6 gap-2 h-full">
                  <IonicIcons name="language" size={20} color="#FFFFFF" />
                  <Text className="text-gray-400 text-base">Language</Text>
                  <Text className="text-gray-300 text-base">
                    {movie.original_language?.toUpperCase()}
                  </Text>
                </View>
                <View className="w-1/3 flex items-start justify-start h-full pl-6 gap-2">
                  <MaterialDesignIcons
                    name="check-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text className="text-gray-400 text-base">Status</Text>
                  <Text className="text-gray-300 text-base">
                    {movie.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Cast Section */}
            <View className="mb-8 px-5">
              <Text className="text-white text-xl font-bold mb-2">Cast</Text>
              <FlatList
                data={credits?.cast
                  ?.sort((a: any, b: any) => b.popularity - a.popularity)
                  ?.slice(0, 10)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="flex items-center justify-center mr-4">
                    <Image
                      source={{
                        uri: item.profile_path
                          ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                          : "https://placehold.co/400x400/1a1a1a/ffffff.png",
                      }}
                      className="w-28 h-28 rounded-full"
                      resizeMode="cover"
                    />
                    <Text className="text-white text-sm mt-2 text-center">
                      {item.name}
                    </Text>
                    <Text className="text-gray-400 text-sm text-center">
                      {item.character}
                    </Text>
                  </View>
                )}
              />
            </View>

            {/* Crew Section */}
            <View className="mb-8 px-5">
              <Text className="text-white text-xl font-bold mb-2">Crew</Text>

              <FlatList
                data={groupedCrew}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }: any) => (
                  <View className="items-center justify-start mr-4 w-28">
                    <Image
                      source={{
                        uri: item.profile_path
                          ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                          : "https://placehold.co/400x400/1a1a1a/ffffff.png",
                      }}
                      className="w-28 h-28 rounded-full"
                      resizeMode="cover"
                    />

                    <Text
                      className="text-white text-sm mt-2 text-center"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>

                    <Text
                      className="text-gray-400 text-sm text-center"
                      numberOfLines={2}
                    >
                      {item.jobs.join(" • ")}
                    </Text>
                  </View>
                )}
              />
            </View>

            {/* Watch Providers */}
            <View className="mb-8 px-5">
              <Text className="text-white text-xl font-bold mb-6">
                Watch Providers
              </Text>

              {uniqueProviders.length > 0 ? (
                <FlatList
                  data={uniqueProviders}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.provider_id.toString()}
                  renderItem={({ item }) => (
                    <View className="flex-col items-center justify-start mr-4">
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w500${item.logo_path}`,
                        }}
                        className="w-20 h-20 rounded-lg"
                        resizeMode="cover"
                      />
                      <Text className="text-white text-sm mt-2 text-center text-wrap w-24">
                        {item.provider_name}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <Text className="text-gray-400 text-base">
                  {movie.status === "Released"
                    ? "No watch providers available"
                    : "Movie not yet released"}
                </Text>
              )}
            </View>

            {/* Trailer Section */}
            <View
              className="mb-8 px-5"
              ref={trailerRef}
              onLayout={(event) => {
                trailerY.current = event.nativeEvent.layout.y;
              }}
            >
              <Text className="text-white text-xl font-bold mb-2">Trailer</Text>
              {key ? (
                <YoutubePlayer
                  width={playerWidth}
                  height={playerHeight}
                  play={false}
                  videoId={key}
                />
              ) : (
                <View
                  className="flex items-center justify-center bg-gray-800 rounded-lg"
                  style={{ height: playerHeight }}
                >
                  <Text className="text-gray-400 text-base">
                    No trailer available
                  </Text>
                </View>
              )}
            </View>

            {/* Similar Movies Section */}
            <View className="mb-4 px-5">
              <Text className="text-white text-xl font-bold mb-2">
                Similar Movies
              </Text>
              <FlatList
                data={similarMovies}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
              />
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default moviesDetail;
