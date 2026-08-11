import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { images } from "../../../constants/images";

import MovieCard from "@/components/common/MovieCard";
import { fetchMovies } from "../../../services/api";
import useFetch from "../../../services/useFetch";
import { icons } from "../../../constants/icons";
import SearchBar from "@/components/home/SearchBar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SortBottomSheet from "@/components/bottom-sheet/SortBottomSheet";
import FilterBottomSheet from "@/components/bottom-sheet/FilterBottomSheet";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const search = () => {
  const { width } = Dimensions.get("window");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const sortSheetRef = useRef<BottomSheetModal>(null);
  const filterSheetRef = useRef<BottomSheetModal>(null);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const {
    data: moviesResponse,
    loading: moviesLoading,
    error: moviesError,
    refetch,
    reset,
  } = useFetch(
    () =>
      fetchMovies({
        query: searchQuery,
        sort_by: sortBy,
        page: page,
        genreId: selectedGenre,
        year: selectedYear,
        language: selectedLanguage,
        rating: selectedRating,
      }),
    true,
  );
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await refetch();
      } else {
        await refetch();
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page, sortBy]);
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <View className="flex-1 bg-primary pb-20">
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
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      {moviesLoading ? (
        <>
          <View className="flex-row justify-center mt-[52px] items-center gap-2 mb-4">
            <Image
              source={icons.logo}
              className="size-16 aspect-square"
              resizeMode="contain"
            />
            <Text className="text-white text-4xl font-semibold">CineVerse</Text>
          </View>

          <View className="mb-5 relative">
            <SearchBar
              onPress={() => {}}
              placeholder="Search for movies..."
              value={searchQuery}
              onChangeText={(text: string) => {
                setSearchQuery(text);
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
              gap: 10,
              flexWrap: "wrap",
              paddingHorizontal: 4,
            }}
            
          >
            {a.map((item) => {
              return (
                <View
                  key={item}
                  style={{
                    width: width / 3 - 10,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                    marginBottom: 5,
                  }}
                  className="animate-pulse"
                >
                  <View
                    style={{
                      aspectRatio: 4 / 6,
                      backgroundColor: "#6b728066",
                      borderRadius: 10,
                    }}
                    className="w-full"
                  ></View>
                  <View
                    style={{
                      marginLeft: "auto",
                      backgroundColor: "#6b728066",
                      borderRadius: 5,
                      marginTop: 5,
                      width: 40,
                      height: 20,
                    }}
                  ></View>
                </View>
              );
            })}
          </View>
        </>
      ) : moviesError ? (
        <Text className="text-red-500 text-center mt-10">
          {moviesError?.message}
        </Text>
      ) : (
        <FlatList
          data={moviesResponse?.results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard {...item} search={"w-1/3"} />}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-evenly",
            marginBottom: 10,
          }}
          className="overflow-hidden "
          ListHeaderComponent={
            <>
              <View className="flex-row justify-center mt-[52px] items-center gap-2 mb-4">
                <Image
                  source={icons.logo}
                  className="size-16 aspect-square"
                  resizeMode="contain"
                />
                <Text className="text-white text-4xl font-semibold">
                  CineVerse
                </Text>
              </View>

              <View className="mb-5 relative">
                <SearchBar
                  onPress={() => {}}
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChangeText={(text: string) => {
                    setSearchQuery(text);
                  }}
                />
                <View className="flex-row items-center gap-2 ml-auto mt-2 mr-4" style={searchQuery.trim()?{opacity:0}:''}>
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

              {moviesResponse.results.length>0?
              searchQuery.trim() ?
               (
                <Text className="text-xl text-white font-bold mb-3 px-3">
                  Search results for
                  <Text className="text-accent"> {searchQuery}</Text>
                </Text>
              ):'' : (
                  
                  <Text className="text-xl text-white font-bold mb-3 px-3">
                    No results found for
                    <Text className="text-accent"> {searchQuery}</Text>
                  </Text>
              )}
            </>
          }
          ListEmptyComponent={
            <View className="mt-40 px-5">
              <Text className="text-center text-gray-500 font-bold">
                {searchQuery.trim()
                  ? ""
                  : "Enter a search query to find movies"}
              </Text>
            </View>
          }
          ListFooterComponent={
            <>
              {moviesResponse.results.length > 19 ? (
                <View className="">
                  <View className="flex-row items-center justify-center w-max-1/2 mx-auto gap-4 mb-10 border border-gray-600/50 rounded-full">
                    <TouchableOpacity
                      className="px-4 py-2 rounded-full border-r border-gray-600/50 flex-row items-center gap-4"
                      onPress={() => {
                        setPage((prev) => {
                          return prev == 1 ? prev : prev - 1;
                        });
                      }}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={20}
                        color={"#FFffff"}
                      />
                      <Text className="text-accent text-lg">Prev</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-lg">Page {page}</Text>
                    <TouchableOpacity
                      className="px-4 py-2 rounded-full border-l border-gray-600/50 flex-row items-center gap-4"
                      onPress={() => {
                        setPage((prev) => {
                          return prev < moviesResponse.total_pages
                            ? prev + 1
                            : prev;
                        });
                      }}
                    >
                      <Text className="text-accent text-center text-lg">
                        Next
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={"#FFffff"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                ""
              )}
            </>
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
      />
    </View>
  );
};

export default search;
