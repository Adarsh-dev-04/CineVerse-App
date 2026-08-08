import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
};

const FeatureChip = ({
  title,
  icon,
  selected,
  onPress,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className={`
        mr-3
        mb-3
        flex-row
        items-center
        rounded-full
        border
        px-4
        py-3

        ${
          selected
            ? "border-[#AB8BFF] bg-[#130D25]"
            : "border-[#241C40] bg-[#090615]"
        }
      `}
    >
      <Ionicons
        name={icon}
        size={18}
        color={selected ? "#AB8BFF" : "#9C98A6"}
      />

      <Text
        className={`ml-2 text-sm font-medium ${
          selected
            ? "text-white"
            : "text-[#9C98A6]"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default FeatureChip;