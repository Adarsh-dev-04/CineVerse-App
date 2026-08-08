import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { images } from "../../../constants/images";
import { router } from "expo-router";

const PromoBanner = () => {
  return (
    <>
      <View
        className="
        mt-3
        rounded-3xl
        border
        border-[#221C36]
        bg-[#090615]
        py-3
        px-2
        flex
        items-start
        gap-1 sm:gap-4
      "
      >
        <View className="flex-row items-start w-full gap-2 mb-2">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#130D25] border border-gray-600/50">
            <Ionicons name="film-outline" size={28} color="#AB8BFF" />
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-white">
              Build your movie library
            </Text>

            <Text className="mt-1 text-sm leading-5 text-wrap text-[#8E8B98]">
              Save movies you love, keep a watchlist, and track what you've
              already watched.
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        className=" w-36 h-12 mt-4 ml-auto rounded-xl bg-accent overflow-hidden"
        onPress={() => {
          router.push("/(tabs)/explore");
        }}
      >
        <ImageBackground
          source={images.highlight}
          className="w-full h-full  absolute left-[-4] px-4 py-2 flex items-center justify-center"
          resizeMode="cover"
        >
          <Text className="font-semibold text-primary">Explore Movies</Text>
        </ImageBackground>
      </Pressable>
    </>
  );
};

export default PromoBanner;
