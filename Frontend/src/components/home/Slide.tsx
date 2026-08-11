import { Link } from "expo-router";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { icons } from "../../../constants/icons";

const { width } = Dimensions.get("window");
const Slide = ({ item }: { item: any }) => {
  return (
    <Link href={`/movies/${item.id}`} asChild>
      <TouchableOpacity style={{ width }}>
        <View className="mx-5 rounded-2xl overflow-hidden">
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/w780${item.backdrop_path}`,
            }}
            resizeMode="cover"
            className="flex justify-end aspect-[16/10] sm:aspect-[16/9]"
          >
            <View className="absolute inset-0 bg-black/40" />

            <View className="p-5">
              <Text className="text-white text-2xl sm:text-4xl font-bold uppercase">
                {item.title}
              </Text>
              <View className="flex-row my-2 gap-2 sm:gap-3">
                <View className="flex-row gap-1">
                  <Image source={icons.star} className="size-5 sm:size-7" />
                  <Text className="text-white sm:text-lg">
                    {Math.round(item.vote_average * 10) / 10}
                  </Text>
                </View>
                <Text className="text-white font-bold sm:text-lg">•</Text>
                <Text className="text-white uppercase sm:text-lg">
                  {item.release_date?.split("-")[0]}
                </Text>
              </View>
              <Text className="text-white sm:text-lg" numberOfLines={2}>
                {item.overview}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default Slide;
