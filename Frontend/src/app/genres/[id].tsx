import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchGenreMovies } from "../../../services/api";
import useFetch from "../../../services/useFetch";
import { FlatList } from "react-native-gesture-handler";
import MovieCard from "@/components/common/MovieCard";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { images } from "../../../constants/images";
import { BlurView } from "expo-blur";

const genrePage = () => {
  const { id, genreName, genreIcon, genreSubtitle } = useLocalSearchParams();
  const [page, setPage] = useState(1);
  const insets = useSafeAreaInsets();
  const genreId = Number(id);
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
    reset,
  } = useFetch(() => fetchGenreMovies({ id: genreId, page: page }), true);

  useEffect(() => {
    refetch();
  }, [page]);

  return (
    <View className="flex-1 bg-primary px-2">
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
      <Image source={images.bg} className="absolute top-0" />
      {moviesLoading ? (
        <ActivityIndicator size="large" color="#0000FF" className="my-3" />
      ) : moviesError ? (
        <Text className="text-red-500 text-center mt-10">
          {moviesError?.message}
        </Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard {...item} search={"w-1/3"} />}
          numColumns={3}
          className="overflow-hidden"
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            marginBottom: 10,
          }}
          ListHeaderComponent={
            <>
              <View className="mt-24 mb-10 ml-5">
                <Text className="text-white text-4xl font-bold ">
                  {genreName} {genreIcon}
                </Text>
                <Text className="text-gray-400 text-base">{genreSubtitle}</Text>
              </View>
            </>
          }
          ListFooterComponent={
            <View>
              <View className="flex-row items-center justify-center w-max-1/2 mx-auto gap-4 mb-10 border border-gray-600/50 rounded-full">
                <TouchableOpacity
                  className="px-4 py-2 rounded-full border-r border-gray-600/50 flex-row items-center gap-4"
                  onPress={() => {
                    setPage((prev) => {
                      return prev - 1;
                    });
                  }}
                >
                  <Ionicons name="chevron-back" size={20} color={"#FFffff"} />
                  <Text className="text-accent text-lg">Prev</Text>
                </TouchableOpacity>
                <Text className="text-white text-xl">Page {page}</Text>
                <TouchableOpacity
                  className="px-4 py-2 rounded-full border-l border-gray-600/50 flex-row items-center gap-4"
                  onPress={() => {
                    setPage((prev) => {
                      return prev + 1;
                    });
                  }}
                >
                  <Text className="text-accent text-center text-lg">Next</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={"#FFffff"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      )}
    </View>
  );
};

export default genrePage;
