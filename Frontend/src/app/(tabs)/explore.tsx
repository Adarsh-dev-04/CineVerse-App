import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";

import ExploreChip from "@/components/explore/ExploreChip";
import GenreCard from "@/components/explore/GenreCard";
import MoviePosterCard from "@/components/explore/MoviePosterCard";
import SectionHeader from "@/components/explore/SectionHeader";

import { Genre, genres } from "@/constants/discoverData";
import useFetch from "../../../services/useFetch";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
} from "../../../services/api";
import MovieCard from "@/components/common/MovieCard";
import { useEffect, useState } from "react";
import GenrePage from "@/components/common/GenrePage";
import { images } from "../../../constants/images";

const Discover = () => {
  const { genreId } = useLocalSearchParams();
  const genreIdNum = Number(genreId);
  const { width } = Dimensions.get("window");
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(() => fetchTrendingMovies(), true);
  const {
    data: topRatedMovies,
    loading: topRatedLoading,
    error: topRatedError,
  } = useFetch(() => fetchTopRatedMovies(), true);

  const [showGenre, setShowGenre] = useState(genreId ? true : false);
  const [genre, setGenre] = useState<number | undefined>(genreIdNum || 0);
  const Error = trendingError || topRatedError;
  const Loading = trendingLoading || topRatedLoading;

  useEffect(() => {
    if (!showGenre) {
      setGenre(undefined);
      return;
    }

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setShowGenre(false);
        setGenre(undefined);
        return true;
      },
    );

    return () => subscription.remove();
  }, [showGenre]);
  useEffect(() => {
    setShowGenre(true);
  }, [genre]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#030014]">
      <Image
        source={images.bg}
        className="absolute top-0 w-full h-auto"
        resizeMode="cover"
      />
      {Loading ? (
        <ScrollView
          className="flex-1 mb-20"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
        >
          <View className="px-5 pt-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-[36px] font-bold text-white">
                  Explore
                </Text>

                <Text className="mt-1 text-[15px] text-[#9C99A6]">
                  Discover movies and find your next favorite
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/search")}
                className="h-12 w-12 items-center justify-center rounded-full border border-[#28233A]"
              >
                <Ionicons name="search-outline" size={23} color="white" />
              </Pressable>
            </View>
          </View>
          <View className="mt-10 pl-1">
            <View className="px-3">
              <SectionHeader
                title="Trending Now"
                onPress={() => {
                  console.log("Trending See All");
                }}
              />
              <View className="flex-row gap-2">
                {[1, 2, 3, 4].map((index) => {
                  return (
                    <View key={index} className="w-[30%] flex-col gap-2">
                      <View className="w-full aspect-[4/6] bg-slate-500/50 rounded-xl animate-pulse"></View>
                      <View className="w-[40%] rounded-md aspect-[5/2] bg-slate-500/50 animate-pulse ml-auto"></View>
                    </View>
                  );
                })}
              </View>
            </View>
            <View className="mt-10 px-3">
              <SectionHeader
                title="Popular Genres"
                onPress={() => {
                  console.log("Genres See All");
                }}
              />

              <View className="flex-row flex-wrap justify-between gap-y-3">
                {genres.map((genre) => (
                  <GenreCard
                    key={genre.id}
                    genre={genre}
                    onPress={() => {
                      setGenre(genre.id);
                    }}
                  />
                ))}
              </View>
            </View>
            <View className="mt-10 mb-10 px-3">
              <SectionHeader
                title="Top Rated"
                onPress={() => {
                  console.log("Trending See All");
                }}
              />
              <View className="flex-row gap-2">
                {[1, 2, 3, 4].map((index) => {
                  return (
                    <View key={index} className="w-[30%] flex-col gap-2">
                      <View className="w-full aspect-[4/6] bg-slate-500/50 rounded-xl animate-pulse"></View>
                      <View className="w-[40%] rounded-md aspect-[5/2] bg-slate-500/50 animate-pulse ml-auto"></View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : Error ? (
        <Text className="text-white text-center mt-10">{Error?.message}</Text>
      ) : showGenre && genre ? (
        <GenrePage genreId={genre as number} setShowGenre={setShowGenre} />
      ) : (
        <ScrollView
          className="flex-1 mb-20"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
        >
          {/* ================= HEADER ================= */}

          <View className="px-5 pt-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-[36px] font-bold text-white">
                  Explore
                </Text>

                <Text className="mt-1 text-[15px] text-[#9C99A6]">
                  Discover movies and find your next favorite
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/search")}
                className="h-12 w-12 items-center justify-center rounded-full border border-[#28233A]"
              >
                <Ionicons name="search-outline" size={23} color="white" />
              </Pressable>
            </View>
          </View>

          {/* ================= FILTER CHIPS ================= */}

          {/* <View className="mt-7">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
            >
              <ExploreChip title="For You" icon="star" active />

              <ExploreChip title="Movies" icon="film-outline" />

              <ExploreChip title="TV Shows" icon="tv-outline" />

              <ExploreChip title="Genres" icon="grid-outline" />

              <ExploreChip title="Year" icon="calendar-outline" />
            </ScrollView>
          </View> */}

          {/* ================= TRENDING ================= */}

          <View className="mt-10 pl-1">
            <View className="px-3">
              <SectionHeader
                title="Trending Now"
                onPress={() => {
                  console.log("Trending See All");
                }}
              />
            </View>

            <FlatList
              horizontal
              initialNumToRender={9}
              data={trendingMovies}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <MovieCard {...item} />}
            />
          </View>

          {/* ================= GENRES ================= */}

          <View className="mt-10 px-5">
            <SectionHeader
              title="Popular Genres"
              onPress={() => {
                console.log("Genres See All");
              }}
            />

            <View className="flex-row flex-wrap justify-between gap-y-3">
              {genres.slice(0,8).map((genre) => (
                <GenreCard
                  key={genre.id}
                  genre={genre}
                  onPress={() => {
                    setGenre(genre.id);
                  }}
                />
              ))}
            </View>
          </View>

          {/* ================= TOP RATED ================= */}

          <View className="my-10 pl-1">
            <View className="px-4">
              <SectionHeader
                title="Top Rated"
                onPress={() => {
                  console.log("Top Rated See All");
                }}
              />
            </View>

            <FlatList
              horizontal
              data={topRatedMovies}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <MovieCard {...item} />}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Discover;
