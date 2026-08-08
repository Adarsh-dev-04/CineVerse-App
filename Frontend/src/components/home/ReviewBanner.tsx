import { Pressable, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../../../constants/images";
import { Link, router } from "expo-router";

const ReviewBanner = () => {
  return (
    <Link href={"/pages/rateReviewPage"} asChild>
      <Pressable
        className="mt-8 overflow-hidden rounded-[28px] border  border-[#241C40] bg-[#090615] active:scale-[0.98] active:opacity-95"
        //   onPress={() => router.push("/pages/rateReviewPage")}
      >
        {/* Background Glow */}

        <View
          className="
        absolute
        -right-10
        top-5
        h-40
        w-40
        rounded-full
        bg-[#AB8BFF]/10
        "
        />

        {/* Content */}

        <View className="flex-1 flex-row">
          {/* Left */}

          <View className="flex-1 px-6 py-6">
            {/* Icon */}

            <View
              className="
            mb-4
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-[#130D25]
            "
            >
              <Ionicons name="star" size={28} color="#AB8BFF" />
            </View>

            <Text className="text-[24px] font-bold text-white">Enjoying</Text>

            <Text className="text-[24px] font-bold text-[#AB8BFF]">
              MovieFlix?
            </Text>

            <Text
              className="
            mt-2
            pr-6
            text-[13px]
            leading-5
            text-[#9B97A8]
            "
            >
              Your review helps more movie lovers discover the app.
            </Text>
          </View>

          {/* Right */}

          <View className="justify-center pr-4">
            <Image
              source={images.reviewPhone}
              resizeMode="contain"
              className="h-72 w-48"
            />
          </View>
        </View>

        {/* CTA */}

        <Pressable
          className="
        absolute
        bottom-5
        right-5
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        border
        border-[#6F57D7]
        bg-[#0E0A1A]
        "
          onPress={() => router.push("/pages/rateReviewPage")}
        >
          <Ionicons name="arrow-forward" size={22} color="#AB8BFF" />
        </Pressable>
      </Pressable>
    </Link>
  );
};

export default ReviewBanner;
