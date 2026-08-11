import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchGenreMovies } from "../../../services/api";
import useFetch from "../../../services/useFetch";
import { FlatList } from "react-native-gesture-handler";
import MovieCard from "@/components/common/MovieCard";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { images } from "../../../constants/images";
import { BlurView } from "expo-blur";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SortBottomSheet from "@/components/bottom-sheet/SortBottomSheet";
import FilterBottomSheet from "@/components/bottom-sheet/FilterBottomSheet";
import { Genre, genres } from "@/constants/discoverData";

const GenrePage = ({
  genreId,
  setShowGenre,
}: {
  genreId: number;
  setShowGenre: Dispatch<SetStateAction<boolean>>;
}) => {
  const [genre, setGenre] = useState<Genre>();
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("popularity.desc");

  const sortSheetRef = useRef<BottomSheetModal>(null);
  const filterSheetRef = useRef<BottomSheetModal>(null);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(genreId);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
    reset,
  } = useFetch(
    () =>
      fetchGenreMovies({
        id: genreId,
        page: page,
        sort_by: sortBy,
        year: selectedYear,
        rating: selectedRating,
        language: selectedLanguage,
      }),
    true,
  );
  useEffect(() => {
    for (let g of genres) {
      if (g.id == genreId)
        setGenre(g);
    }
  }, [genreId]);

  useEffect(() => {
    refetch();
  }, [page, sortBy, selectedLanguage, selectedRating, selectedYear]);

  return (
    <View className="flex-1 pb-20">
      {/* <Image source={images.bg} className="absolute top-0 w-full h-auto" /> */}
      {moviesLoading ? (
        <ActivityIndicator size="large" color="#0000FF" className="my-3" />
      ) : moviesError ? (
        <Text className="text-red-500 text-center mt-10">
          {moviesError?.message}
        </Text>
      ) : (
        <FlatList
          data={movies.results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard {...item} search={"w-1/3"} />}
          numColumns={3}
          className="overflow-hidden"
          columnWrapperStyle={{
            justifyContent: "space-evenly",
            marginBottom: 10,
          }}
          ListHeaderComponent={
            <>
              <View className="mt-16 mb-5 ml-5">
                <View className="flex-row items-center mr-auto mb-4">
                  <Pressable
                    onPress={() => {
                      setShowGenre(false);
                    }}
                  >
                    <Text className="text-gray-400 font-semibold">Explore</Text>
                  </Pressable>
                  <Entypo
                    name="chevron-small-right"
                    color={"#AB8BFF"}
                    size={20}
                  />
                  <Pressable>
                    <Text className="text-gray-400 font-semibold">Genre</Text>
                  </Pressable>
                  <Entypo
                    name="chevron-small-right"
                    color={"#AB8BFF"}
                    size={20}
                  />
                </View>
                <Text className="text-white text-4xl font-bold ">
                  {genre?.name} {genre?.icon}
                </Text>
                <Text className="text-gray-400 text-base">
                  {genre?.subtitle}
                </Text>
                <Text className="text-accent text-base font-semibold mt-2">
                  {movies.total_results}
                  <Text className="text-gray-400 text-base"> Movies</Text>
                </Text>
                <View className="flex-row justify-between mt-3">
                  <View className="flex-row items-center gap-2 ml-auto mr-4">
                    <TouchableOpacity
                      className="flex-row items-center gap-2 px-2 py-1 border border-gray-600/50 rounded-full"
                      onPress={() => filterSheetRef.current?.present()}
                    >
                      <MaterialCommunityIcons
                        name="filter-outline"
                        color={"#AB8BFF"}
                        size={20}
                      />
                      <Text className="text-white text-base font-semibold">
                        Filter
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center gap-2 px-2 py-1 border border-gray-600/40 rounded-full"
                      onPress={() => {
                        sortSheetRef.current?.present();
                      }}
                    >
                      <MaterialCommunityIcons
                        name="sort-variant"
                        color={"#AB8BFF"}
                        size={20}
                      />
                      <Text className="text-white text-base font-semibold">
                        Sort
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
      <SortBottomSheet
        ref={sortSheetRef}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <FilterBottomSheet
        ref={filterSheetRef}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onApply={() => {
          setPage(1);
          refetch();
        }}
        genrePage={true}
      />
    </View>
  );
};

export default GenrePage;
