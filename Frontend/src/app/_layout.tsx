import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import "./globals.css";

import * as SplashScreen from "expo-splash-screen";
import AnimatedSplash from "./AnimatedSplash";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthProvider } from "../contexts/AuthContext";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { MovieInteractionProvider } from "@/contexts/MovieInteractionContext";
import { useEffect, useState } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 ,backgroundColor: "#030014",}}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <BottomSheetProvider>
              <StatusBar style="light" />

              <AuthProvider>
                <MovieInteractionProvider>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: {
                        backgroundColor: "#030014",
                      },
                      animation: 'fade',
                      animationDuration: 250,
                      animationTypeForReplace: "pop",
                    }}
                  >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="movies/[id]" />
                    <Stack.Screen name="movie-interaction/[pageType]" />
                    <Stack.Screen name="pages/edit-profile" />
                    <Stack.Screen name="pages/preferences" />
                    <Stack.Screen name="pages/rateReviewPage" />
                  </Stack>
                </MovieInteractionProvider>
              </AuthProvider>
            </BottomSheetProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
        {showSplash && (
          <AnimatedSplash
            onFinish={async () => {
              setShowSplash(false);
            }}
          />
        )}
      </GestureHandlerRootView>
    </>
  );
}
