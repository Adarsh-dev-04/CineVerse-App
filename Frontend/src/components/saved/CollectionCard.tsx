import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import MoviePreviewStack from "./MoviePreviewStack";
import { Link, RelativePathString } from "expo-router";

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  movieCount: number;
  pageType: string;
  movies: Array<Movie>;
};

const CollectionCard = ({
  title,
  subtitle,
  icon,
  pageType,
  iconColor = "#AB8BFF",
  movieCount = 0,
  movies,
}: Props) => {
  const moviesPoster: Array<string> = [];
  movies.forEach((movie) => {
    moviesPoster.push(movie.poster_path as string);
  });
  return (
    <Link href={`/movie-interaction/${pageType}` as RelativePathString} asChild>

      <Pressable className="mb-5 rounded-3xl border border-gray-700/60 bg-[#090615] py-4 px-3 active:opacity-80 flex-row items-center justify-center"
       onPress={()=>{}}>

        <View className="flex-col gap-4 items-center justify-center w-full">
          <View className="flex-row justify-start items-center w-full gap-4">
            <View
              className="px-2 py-2 items-center justify-center rounded-full border border-[#2A2344] bg-[#110B22]"
              >
              <Ionicons name={icon} size={28} color={iconColor} />
            </View>
            <View>
              <Text className="text-xl font-bold text-white">
                {title}
                <Text className="text-gray-400 font-normal text-xl ml-2">
                  {" ("}
                  {movieCount}
                  {")"}
                </Text>
              </Text>

              <Text className="text-base text-[#8B8896]">{subtitle}</Text>
            </View>
          </View>

          <View className="flex-col w-full gap-2 sm:gap-4">
            <View className="ml-auto w-full">
              <MoviePreviewStack
                posters={moviesPoster}
                remaining={movieCount - 3}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default CollectionCard;
