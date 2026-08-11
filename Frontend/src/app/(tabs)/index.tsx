import {
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { images } from "../../../constants/images";
import { icons } from "../../../constants/icons";
import SearchBar from "@/components/home/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "../../../services/useFetch";
import {
  fetchMovies,
  fetchNowPlayingMovies,
  UpcomingMovies,
} from "../../../services/api";
import MovieCard from "@/components/common/MovieCard";
import Slide from "@/components/home/Slide";
import { fetchTopRatedMovies } from "../../../services/api";
import { useEffect, useState, useRef} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { getToken } from "@/utils/tokenStorage";
import { useAuth } from "@/contexts/AuthContext";
import ReviewBanner from "@/components/home/ReviewBanner";
export default function Index() {
  const { setToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();


  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
  } = useFetch(() => fetchMovies({ query: "", page: 1 }), true);

  const {
    data: nowplayingMovies,
    loading: nowplayingLoading,
    error: nowplayingError,
  } = useFetch(() => fetchNowPlayingMovies(), true);


  const {
    data: topRated,
    loading: topRatedLoading,
    error: topRatedError,
  } = useFetch(() => fetchTopRatedMovies(), true);


  const {
    data: UpcomingMoviesData,
    loading: UpcomingLoading,
    error: UpcomingError,
  } = useFetch(() => UpcomingMovies(), true);


  useEffect(() => {
    let mounted = true;
    (async () => {
      const t = await getToken();
      if (mounted) setToken(t);
    })();
    return () => {
      mounted = false;
    };
  }, [setToken]);

  const heroRef = useRef<FlatList<Movie>>(null);

  const Loading =
    moviesLoading || nowplayingLoading || topRatedLoading || UpcomingLoading;
  const Error =
    moviesError || nowplayingError || topRatedError || UpcomingError;

  const heroMovies = nowplayingMovies?.slice(0, 5) ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev: number) => {
        const totalItems = heroMovies.length;

        if (totalItems === 0) {
          return prev;
        }

        const next = (prev + 1) % totalItems;
        heroRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [heroMovies.length]);
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

      <Image source={images.bg} className="absolute z-0 w-full" />
      <ScrollView
        className="flex-1 mb-20"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
      >
        <View
          className="flex-row items-center justify-center gap-2 mb-4"
          style={{
            marginTop: insets.top + 12,
          }}
        >
          <Image
            source={icons.logo}
            className="aspect-square size-16"
            resizeMode="contain"
          />
          <Text className="text-white text-4xl font-semibold">CineVerse</Text>
        </View>

        {Loading ? (
          <ActivityIndicator
            size="large"
            color="#0000FF"
            className="mt-10 self-center"
          />
        ) : Error ? (
          <Text className="text-white text-center mt-10">{Error?.message}</Text>
        ) : (
          <View className="flex">
            <View className="mb-5">
              <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Search for movies..."
              />
            </View>

            <FlatList
              data={heroMovies}
              ref={heroRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              className="mb-8"
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Slide item={item} />}
              bounces={false}
            />

            <View className="px-5 mb-8">
              <Text className="text-white text-2xl font-semibold mb-4">
                Popular Movies
              </Text>
              <FlatList
                data={movies.results}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
              />
            </View>

            <View className="px-5 mb-8">
              <Text className="text-white text-2xl font-bold mb-4">
                Top Rated
              </Text>
              <FlatList
                data={topRated}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
              />
            </View>

            <View className="px-5 mb-8">
              <Text className="text-white text-2xl font-bold mb-4">
                Upcoming Movies
              </Text>
              <FlatList
                data={UpcomingMoviesData}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
              />
            </View>
            <View className="px-5 mb-8">
              <ReviewBanner />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
