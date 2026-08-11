import { Text, TextInput, View } from "react-native";
import { Fontisto, FontAwesome } from "@expo/vector-icons";

type InputBoxProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type: "name" | "email";
  error?: string;
};

const InputBox = ({
  value,
  type,
  onChangeText,
  placeholder = "Password",
  error,
}: InputBoxProps) => {
  return (
    <View className="w-full">
      {/* Input Container */}
      <View
        className={`
          h-16
          flex-row
          items-center
          rounded-2xl
          border
          bg-[#090615]
          px-4
          ${error ? "border-red-500" : "border-[#241C40]"}
        `}
      >
        {/* Lock Icon */}
        {type == "email" ? (
          <Fontisto name="email" size={20} color="#85818F" />
        ) : (
          <FontAwesome name="user-o" size={20} color="#85818F" />
        )}

        {/* Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6C6878"
          //   #9ca3af
          autoCapitalize="none"
          autoCorrect={true}
          className="
            ml-3
            flex-1
            text-base
            text-white
          "
        />
      </View>

      {/* Error */}
      {error && <Text className="mt-2 px-1 text-sm text-red-400">{error}</Text>}
    </View>
  );
};

export default InputBox;
