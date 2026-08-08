import {
  Pressable,
  Text,
  View,
} from "react-native";

import { Genre } from "@/constants/discoverData";

type Props = {
  genre: Genre;
  onPress?: () => void;
};

const GenreCard = ({
  genre,
  onPress,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] overflow-hidden rounded-xl border border-[#211D35] bg-[#0C0818] px-3 py-4"
    >
      <View className="items-center">
        <Text className="text-3xl">
          {genre.icon}
        </Text>

        <Text className="mt-2 text-base font-semibold text-white">
          {genre.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default GenreCard;