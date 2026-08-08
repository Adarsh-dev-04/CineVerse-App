import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const BenefitCard = ({
  title,
  description,
  icon,
}: Props) => {
  return (
    <Pressable
      className="
        mb-4
        flex-row
        items-center
        rounded-3xl
        bg-[#090615]
        p-5
        active:opacity-80
      "
    >
      <View
        className="
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#130D25]
        "
      >
        <Ionicons
          name={icon}
          size={28}
          color="#AB8BFF"
        />
      </View>

      <View className="ml-5 flex-1">
        <Text className="text-xl font-semibold text-white">
          {title}
        </Text>

        <Text className="mt-2 text-[15px] leading-6 text-[#8F8C98]">
          {description}
        </Text>
      </View>
    </Pressable>
  );
};

export default BenefitCard;