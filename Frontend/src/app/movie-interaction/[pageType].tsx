import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { images } from "../../../constants/images";
import useFetch from "../../../services/useFetch";
import { getMovieInteractionByType } from "@/api/movieInteractionApi";
import { useCallback, useEffect, useState } from "react";
import MovieCard from "@/components/common/MovieCard";
import { icons } from "../../../constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { AxiosResponse } from "axios";
import { useLocalSearchParams } from "expo-router";

type Detail = {
  title: string;
  icon: string;
  subtitle: string;
};

const favoritePage = () => {
  const { pageType } = useLocalSearchParams();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const pageDetail: Record<"favorite" | "watched" | "watchlist", Detail> = {
    favorite: {
      title: "Favorites",
      subtitle: "Movies you love",
      icon: "heart",
    },
    watchlist: {
      title: "Watchlist",
      subtitle: "Movies to watch later",
      icon: "list",
    },
    watched: {
      title: "Watched",
      subtitle: "Movies you've finished",
      icon: "checkmark-done",
    },
  };

  const currentPageDetail = pageDetail[pageType as keyof typeof pageDetail];
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMovieInteractionByType({
        type: pageType,
        page: page,
      });
      setData(result.data?.movies);
    } catch (err) {
      //@ts-ignore

      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      {error ? (
        ""
      ) : (
        <>
          <View className="px-5 mt-24 flex-row justify-start items-center gap-4 mb-10">
            <View className="self-start border border-gray-600 px-4 py-4 rounded-full">
              <Ionicons
                name={currentPageDetail.icon as any}
                size={25}
                color={"#FFFFFF"}
              />
            </View>
            <View>
              <Text className="text-white text-4xl font-bold capitalize">
                {currentPageDetail.title}
              </Text>
              <Text className="text-gray-400 text-lg">
                {currentPageDetail.subtitle}
              </Text>
            </View>
          </View>
          {loading && (
            <ActivityIndicator size="large" color="#0000FF" className="my-3" />
          )}
          <FlatList
            data={data}
            keyExtractor={(item) => item.tmdbId.toString()}
            renderItem={({ item }) => (
              <MovieCard
                id={item.tmdbId}
                title={item.title}
                poster_path={item.poster_path}
                vote_average={item.vote_average}
                release_date={item.release_date}
                search="w-1/3"
              />
            )}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 10,
              marginBottom: 10,
            }}
            className="px-4 overflow-hidden"
          />
        </>
      )}
    </View>
  );
};

export default favoritePage;
