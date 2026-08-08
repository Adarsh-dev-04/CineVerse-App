import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const SubmitButton = ({
  onPress,
  disabled = false,
}: Props) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`
        mt-10
        h-16
        flex-row
        items-center
        justify-center
        rounded-2xl

        ${
          disabled
            ? "bg-[#3A3350]"
            : "bg-[#AB8BFF]"
        }
      `}
    >
      <Ionicons
        name="star"
        size={24}
        color="#030014"
      />

      <Text
        className="
          ml-3
          text-xl
          font-bold
          text-[#030014]
        "
      >
        Submit Review
      </Text>
    </Pressable>
  );
};

export default SubmitButton;