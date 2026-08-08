import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { images } from "../../../constants/images";

import MovieCard from "@/components/common/MovieCard";
import { fetchMovies } from "../../../services/api";
import useFetch from "../../../services/useFetch";
import { icons } from "../../../constants/icons";
import SearchBar from "@/components/home/SearchBar";
import { Ionicons } from "@expo/vector-icons";

const search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await refetch();
      } else {
        reset();
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <View className="flex-row justify-center mt-[52px] items-center gap-2 mb-4">
        <Image
          source={icons.logo}
          className="size-16 aspect-square"
          resizeMode="contain"
        />
        <Text className="text-white text-4xl font-semibold">CineVerse</Text>
      </View>

      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View className="flex-1 px-5 justify-center items-center">
          <View className="bg-[#1a1a2e] border border-gray-400/50 w-full h-1/2 rounded-2xl p-5">
            <Text className="text-white text-2xl font-bold mb-5">
              Filter & Sort
            </Text>
            <TouchableOpacity
              className="bg-accent absolute top-4 right-4 rounded-md py-2 px-4 w-28"
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} search={"w-1/3"} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          marginBottom: 10,
        }}
        className="px-5 overflow-hidden"
        ListHeaderComponent={
          <>
            <View className="mb-5 relative">
              <SearchBar
                onPress={() => {}}
                placeholder="Search for movies..."
                value={searchQuery}
                onChangeText={(text: string) => {
                  setSearchQuery(text);
                }}
              />
              <TouchableOpacity
                className="-bottom-4 -right-80"
                onPress={() => setIsFilterModalVisible(true)}
              >
                <Text className="text-accent">Filter & Sort</Text>
              </TouchableOpacity>
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000FF"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 text-center mt-10">
                {moviesError?.message}
              </Text>
            )}

            {!moviesLoading &&
            !moviesError &&
            searchQuery.trim() &&
            movies?.length > 0 ? (
              <Text className="text-xl text-white font-bold mb-3">
                Search results for
                <Text className="text-accent"> {searchQuery}</Text>
              </Text>
            ) : (
              !moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              movies?.length === 0 && (
                <Text className="text-xl text-white font-bold mb-3">
                  No results found for
                  <Text className="text-accent"> {searchQuery}</Text>
                </Text>
              )
            )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-40 px-5">
              <Text className="text-center text-gray-500 font-bold">
                {searchQuery.trim()
                  ? ""
                  : "Enter a search query to find movies"}
              </Text>
            </View>
          ) : null
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
                <Ionicons name="chevron-forward" size={20} color={"#FFffff"} />
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default search;
