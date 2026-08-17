import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

import { verifyOTP, resendOTP } from "@/api/authApi";
import { saveToken } from "@/utils/tokenStorage";
import { useAuth } from "@/contexts/AuthContext";
import { images } from "../../../constants/images";
import { icons } from "../../../constants/icons";
import { LinearGradient } from "expo-linear-gradient";
import OTPInput from "@/components/auth/OTPInput";

export default function VerifyOTP() {
  const router = useRouter();
  const { login } = useAuth();

  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const otpInputRef = useRef<TextInput>(null);

  // -----------------------------
  // RESEND TIMER
  // -----------------------------
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // -----------------------------
  // VERIFY OTP
  // -----------------------------
  const handleVerifyOTP = async () => {
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyOTP(email, otp);

      await saveToken(data.token);

      login(data.user, data.token);

      router.replace("/(tabs)/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to verify OTP. Please try again.",
        );
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // RESEND OTP
  // -----------------------------
  const handleResendOTP = async () => {
    if (resendTimer > 0 || resendLoading) {
      return;
    }

    setError("");

    try {
      setResendLoading(true);

      const data = await resendOTP(email);

      setOtp("");

      setResendTimer(60);

      setError("");

      console.log(data.message);

      otpInputRef.current?.focus();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        setError(
          responseData?.message || "Unable to resend OTP. Please try again.",
        );

        // Backend sends retryAfter when cooldown is active
        if (responseData?.retryAfter) {
          setResendTimer(responseData.retryAfter);
        }
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  // -----------------------------
  // OTP DIGITS
  // -----------------------------
  const otpDigits = otp.padEnd(6, "").split("");

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={images.signupBg}
        className="w-full h-[40%]"
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.1)",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.7)",
            "#000000",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <Image source={icons.logo} className="w-12 h-10 self-center mt-20" />

        <View className="px-5">
          <Text className="text-white mt-[40%] text-3xl font-bold">
            Verify your email
          </Text>

          <Text className="text-gray-400 mt-3">
            We've sent a 6-digit verification code to
          </Text>

          <Text className="text-accent mt-1 font-semibold">{email}</Text>

          <View className="mt-10 mx-20">
            <OTPInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError("");
              }}
              error={!!error}
            />
          </View>

          {/* ERROR */}
          {error ? (
            <Text className="text-red-400 text-sm mt-4 text-center">
              {error}
            </Text>
          ) : null}

          {/* VERIFY BUTTON */}
          <TouchableOpacity
            onPress={handleVerifyOTP}
            disabled={loading}
            className="w-full h-16 bg-accent rounded-xl mt-7 items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator size="large" color="#030014" />
            ) : (
              <Text className="text-primary text-lg font-bold">Verify OTP</Text>
            )}
          </TouchableOpacity>

          {/* RESEND */}
          <View className="items-center mt-6">
            <Text className="text-gray-500 text-sm">
              Didn't receive the code?
            </Text>

            {resendTimer > 0 ? (
              <Text className="text-gray-400 text-sm mt-2">
                Resend OTP in{" "}
                <Text className="text-accent font-semibold">
                  {resendTimer}s
                </Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendLoading}
                className="mt-2"
              >
                {resendLoading ? (
                  <ActivityIndicator size="small" color="#A8B5DB" />
                ) : (
                  <Text className="text-accent font-semibold text-sm">
                    Resend OTP
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
