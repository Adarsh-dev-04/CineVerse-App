import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
} from "react-native";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress?: () => void;
};

const ExploreChip = ({
  title,
  icon,
  active = false,
  onPress,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-3 flex-row items-center rounded-xl border px-4 py-3 ${
        active
          ? "border-[#AB8BFF] bg-[#AB8BFF]/10"
          : "border-[#262136] bg-[#080512]"
      }`}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? "#AB8BFF" : "#A8A5B0"}
      />

      <Text
        className={`ml-2 text-[14px] font-medium ${
          active
            ? "text-[#AB8BFF]"
            : "text-[#D5D3DB]"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default ExploreChip;