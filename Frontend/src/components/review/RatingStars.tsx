import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
  rating: number;
  onChange: (value: number) => void;
};

const RatingStars = ({ rating, onChange }: Props) => {
  return (
    <View className="mt-8 flex-row items-center justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} className="mx-2">
          <View
            className={`h-16 w-16 items-center justify-center rounded-full ${rating >= star ? "bg-[#130D25]" : "bg-transparent"} `}>
            <Ionicons
              name={rating >= star ? "star" : "star-outline"}
              size={36}
              color={rating >= star ? "#AB8BFF" : "#6C6584"}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default RatingStars;
