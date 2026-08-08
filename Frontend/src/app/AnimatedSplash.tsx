import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type AnimatedSplashProps = {
  onFinish: () => void;
};

const AnimatedSplash = ({ onFinish }: AnimatedSplashProps) => {
  const backgroundOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.32);

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);

  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(15);

  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    const easeOut = Easing.out(Easing.cubic);

    // Background
    backgroundOpacity.value = withTiming(1, {
      duration: 500,
      easing: easeOut,
    });

    // Logo
    logoOpacity.value = withDelay(
      150,
      withTiming(1, {
        duration: 600,
        easing: easeOut,
      }),
    );

    logoScale.value = withDelay(
      150,
      withTiming(0.5, {
        duration: 750,
        easing: easeOut,
      }),
    );

    // Title
    titleOpacity.value = withDelay(
      600,
      withTiming(1, {
        duration: 500,
        easing: easeOut,
      }),
    );

    titleY.value = withDelay(
      600,
      withTiming(0, {
        duration: 500,
        easing: easeOut,
      }),
    );

    // Tagline
    taglineOpacity.value = withDelay(
      900,
      withTiming(1, {
        duration: 500,
        easing: easeOut,
      }),
    );

    taglineY.value = withDelay(
      900,
      withTiming(0, {
        duration: 500,
        easing: easeOut,
      }),
    );

    // Finish
    const timer = setTimeout(() => {
      splashOpacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.in(Easing.cubic),
      });

      setTimeout(() => {
        onFinish();
      }, 500);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      {
        scale: logoScale.value,
      },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      {
        translateY: titleY.value,
      },
    ],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [
      {
        translateY: taglineY.value,
      },
    ],
  }));

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return (
    <Animated.View
      style={[styles.container, splashStyle]}
    >
      {/* Background */}
        <Animated.Image
          source={require("@/assets/splash-bg.png")}
          resizeMode="cover"
          style={[styles.background, backgroundStyle]}
        />

        {/* Content */}
        <View style={styles.content}>
          <Animated.Image
            source={require("@/assets/CineVerse logo new.png")}
            resizeMode="contain"
            style={[styles.logo, logoStyle]}
          />

          <View style={styles.textContainer} >
            <Animated.Text style={[styles.title, titleStyle]}>
              CineVerse
            </Animated.Text>

            <Animated.Text style={[styles.tagline, taglineStyle]}>
              DISCOVER, WATCH, EXPERIENCE.
            </Animated.Text>
          </View>
        </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#030014",
    zIndex: 9999,
    elevation: 9999,
  },

  background: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: "50%",
    aspectRatio: 1,
  },

  textContainer: {
    alignItems: "center",
    marginTop: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.5,
    textAlign: "center",
  },

  tagline: {
    marginTop: 8,
    color: "#D7A8FF",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 4,
    textAlign: "center",
  },
});

export default AnimatedSplash;
