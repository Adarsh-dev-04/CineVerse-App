import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PasswordInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
};

const PasswordInput = ({
  value,
  onChangeText,
  placeholder = "Password",
  error,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
          ${
            error
              ? "border-red-500"
              : "border-[#241C40]"
          }
        `}
      >
        {/* Lock Icon */}
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#85818F"
        />

        {/* Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6C6878"
        //   #9ca3af
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          className="
            ml-3
            flex-1
            text-base
            text-white
          "
        />

        {/* Show / Hide */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            setShowPassword((prev) => !prev)
          }
          className="ml-2 p-1"
        >
          <Ionicons
            name={
              showPassword
                ? "eye-outline"
                : "eye-off-outline"
            }
            size={21}
            color="#85818F"
          />
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error && (
        <Text className="mt-2 px-1 text-sm text-red-400">
          {error}
        </Text>
      )}
    </View>
  );
};

export default PasswordInput;