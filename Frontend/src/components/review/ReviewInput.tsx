import { Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
};

const ReviewInput = ({ value, onChangeText, maxLength = 500 }: Props) => {
  return (
    <View className="mt-8 w-full flex-1 px-4">
      <Text className="mb-3 text-xl w-full font-semibold text-white">
        Tell us more (optional)
      </Text>

      <View
        className="
          rounded-3xl
          border
          border-[#241C40]
          bg-[#090615]
          p-4
        "
      >
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Share your thoughts about CineVerse..."
          placeholderTextColor="#6C6584"
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          className="
            text-base
            leading-6
            text-white
          "
          style={{
            minHeight: 140,
          }}
        />

        <View className="mt-3 flex-row justify-end">
          <Text className="text-sm text-[#6C6584]">
            {value.length}/{maxLength}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewInput;
