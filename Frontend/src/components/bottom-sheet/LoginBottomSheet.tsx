import React, { forwardRef, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type LoginBottomSheetProps = {
  message?: string;
  icon: 'bookmark'|'heart'|'user'|'edit';
  onLogin: () => void;
  onSignup: () => void;
};

const LoginBottomSheet = forwardRef<BottomSheetModal, LoginBottomSheetProps>(
  ({message,icon, onLogin, onSignup}, ref) => {
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["25%"], []);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDismissOnClose
        android_keyboardInputMode="adjustResize"
        handleIndicatorStyle={{
          backgroundColor: "transparent",
          width: 40,
        }}
        backgroundStyle={{
          backgroundColor: "#1A1A2E",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          elevation: 12,
        }}
        backdropComponent={(props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.6}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView
          className="bg-[#1A1A2E] px-5 pt-5"
          style={{
            paddingBottom: insets.bottom + 16,
          }}
        >
          <View className="flex gap-2 mb-4">
            <View className=" h-10 flex-row items-center ">
              <View className="pl-1 pr-2 h-full items-center justify-center">
                <FontAwesome name={icon} size={20} color={"#FFFFFF"} />
              </View>
              <Text className="text-accent text-lg">
                {message}
              </Text>
            </View>
            <Text className="text-white text-lg">
              Sign in to keep your favorite movies in one place and access them
              anytime.
            </Text>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onLogin}
              activeOpacity={0.8}
              className="flex-1 items-center justify-center rounded-xl bg-accent py-3.5"
            >
              <Text className="text-primary text-base font-semibold">
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSignup}
              activeOpacity={0.8}
              className="flex-1 items-center justify-center rounded-xl border border-gray-600 py-3.5"
            >
              <Text className="text-base font-semibold text-white">Signup</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

LoginBottomSheet.displayName = "LoginBottomSheet";

export default LoginBottomSheet;
