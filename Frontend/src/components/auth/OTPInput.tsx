import React, { useRef } from "react";
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  error = false,
}: OTPInputProps) {
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, "").slice(-1);

    const current = value.split("");
    current[index] = digit;

    const newValue = current.join("").slice(0, 6);

    onChange(newValue);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !value[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center gap-3 w-full">
      {Array.from({ length: 6 }).map((_, index) => {
        const digit = value[index] || "";
        const isFocused = inputs.current[index]?.isFocused();

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectionColor="#A8B5DB"
            className={`
              w-14
              aspect-square
              rounded-xl
              border
              bg-[#090615]
              text-white
              text-2xl
              font-bold
              ${error
                ? "border-red-500"
                : isFocused
                  ? "border-accent"
                  : digit
                    ? "border-accent/60"
                    : "border-gray-400/30"
              }
            `}
          />
        );
      })}
    </View>
  );
}