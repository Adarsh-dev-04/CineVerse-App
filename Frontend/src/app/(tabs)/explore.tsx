import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ExploreChip from "@/components/explore/ExploreChip";
import GenreCard from "@/components/explore/GenreCard";
import MoviePosterCard from "@/components/explore/MoviePosterCard";
import SectionHeader from "@/components/explore/SectionHeader";

import { genres } from "@/constants/discoverData";
import useFetch from "../../../services/useFetch";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
} from "../../../services/api";
import MovieCard from "@/components/common/MovieCard";
import { setParams } from "expo-router/build/react-navigation/routers/CommonActions";

const Discover = () => {
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
  const Error = trendingError;
  const Loading = trendingLoading;
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#030014]">
      {Loading ? (
        <ActivityIndicator
          size="large"
          color="#0000FF"
          className="mt-10 self-center"
        />
      ) : Error ? (
        <Text className="text-white text-center mt-10">{Error?.message}</Text>
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
              {genres.map((genre) => (
                <GenreCard
                  key={genre.id}
                  genre={genre}
                  onPress={() => {
                    router.push({
                      pathname: `/genres/${genre.id}` as any,
                      params: {
                        genreName: genre.name,
                        genreIcon: genre.icon,
                        genreSubtitle: genre.subtitle,
                      },
                    });
                  }}
                />
              ))}
            </View>
          </View>

          {/* ================= TOP RATED ================= */}

          <View className="mt-10 pl-1">
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
