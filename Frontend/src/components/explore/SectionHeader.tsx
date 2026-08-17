import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
};

const SectionHeader = ({ title, onPress }: Props) => {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-[22px] font-bold text-white">
        {title}
      </Text>

      <Pressable
        onPress={onPress}
        className="flex-row items-center"
      >
        {/* <Text className="mr-1 text-[15px] font-medium text-[#AB8BFF]">
          See All
        </Text>

        <Ionicons
          name="chevron-forward"
          size={16}
          color="#AB8BFF"
        /> */}
      </Pressable>
    </View>
  );
};

export default SectionHeader;