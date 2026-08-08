import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View, Dimensions } from "react-native";

import { icons } from "../../../constants/icons";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

type Props = {
  movie: Movie;
  showYear?: boolean;
  onPress?: () => void;
};

const MoviePosterCard = ({ movie, showYear = false, onPress }: Props) => {
  const { width } = Dimensions.get("window");
  return (
    <Pressable onPress={onPress} style={{ width: (width / 3)-10  }}>
      {/* Poster */}
      <View className="relative overflow-hidden w-full rounded-xl border border-[#211D35]">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
          }}
          className="aspect-[4/6]"
          resizeMode="cover"
        />

        {/* Rating */}
        <View className="absolute left-2 top-2 flex-row items-center justify-end rounded-md bg-[#0B0718]/90 px-2 py-1">
          <Image source={icons.star} className="size-4 sm:size-6" />

          <Text className="ml-1 text-base font-semibold text-white">
            {Math.round(movie.vote_average * 10) / 10}
          </Text>
        </View>

        {/* Year */}
        {showYear && (
          <View className="absolute bottom-2 left-2 rounded-md bg-[#100923]/90 px-2 py-1">
            <Text className="text-[12px] font-semibold text-white">
              {movie.release_date?.split("-")[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Movie title */}
      <Text
        numberOfLines={2}
        className="mt-2 text-[15px] font-semibold leading-5 text-white"
      >
        {movie.title}
      </Text>

      {/* Genres */}
      {/* <Text
        numberOfLines={1}
        className="mt-1 text-[13px] text-[#9CA3AF]"
      >
        {movie.genres.join(" • ")}
      </Text> */}
    </Pressable>
  );
};

export default MoviePosterCard;
