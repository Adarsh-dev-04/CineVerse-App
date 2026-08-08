import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "../../../constants/icons";

const MovieCard = ({
  id,
  title,
  poster_path,
  vote_average,
  release_date,
  search
}: {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  search: string;

}) => {
  const { width } = Dimensions.get("window");
  return (
    <Link href={`/movies/${id}`} className={`${search} mb-4`} asChild >
      <TouchableOpacity className="w-[30%] md:w-[25%]" style={search? '' : { width: (width - 40) / 3, marginRight: 10 }}>
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://via.placeholder.com/600x400/1a1a1a/ffffff.png",
          }}
          className="aspect-[4/6] rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-white font-bold mt-2 mb-6" numberOfLines={1}>{title}</Text>
        <View className="flex flex-row items-center gap-2 absolute bottom-0">
            <Image source={icons.star} className="size-4"/>
            <Text className="text-white text-xs font-bold uppercase">{Math.round(vote_average * 10) / 10}</Text>
        </View>
        <View className="flex flex-row items-center gap-2 absolute bottom-0 right-0">
            <Text className="text-light-300 text-xs font-bold uppercase">{release_date?.split("-")[0]}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
