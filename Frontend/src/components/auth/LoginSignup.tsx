import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { images } from "../../../constants/images";
import { LinearGradient } from "expo-linear-gradient";
import { icons } from "../../../constants/icons";
import { loginUser, registerUser } from "@/api/authApi";
import { saveToken } from "@/utils/tokenStorage";
import { Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import PasswordInput from "./PasswordInput";
import EmailInput from "./EmailInput";
import InputBox from "./EmailInput";
import axios from "axios";
import { router } from "expo-router";

type props = {
  mode: string | string[];
  setMode: any;
  email: string;
  setEmail: any;
  name: string;
  setName: any;
};

const Login = ({ mode, setMode, email, setEmail, name, setName }: props) => {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const [signupError, setSignupError] = useState("");

  async function handleLogin() {
    setEmailError("");
    setPasswordError("");
    setFormError("");

    try {
      setLoading(true);

      const response = await loginUser(email, password);

      await saveToken(response.data.token);
      login(response.data.user, response.data.token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        switch (status) {
          case 404:
            setEmailError("No account found with this email.");
            break;

          case 401:
            setPasswordError("Incorrect password. Please try again.");
            break;

          case 400:
            setFormError(message || "Please check your information.");
            break;

          default:
            setFormError(message || "Something went wrong. Please try again.");
        }
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setSignupError("");

    if (!name.trim()) {
      setSignupError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setSignupError("Please enter your email.");
      return;
    }

    if (!password) {
      setSignupError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(name, email, password);
      router.push({
        pathname: "/auth/verifyOtp",
        params: {
          email: data.email,
        },
      });
    } catch (error) {
      console.log("========== SIGNUP ERROR ==========");
      console.log("Error:", error);

      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
        console.log("URL:", error.config?.url);
        console.log("Method:", error.config?.method);
      }

      console.log("===================================");

      if (axios.isAxiosError(error)) {
        setSignupError(
          error.response?.data?.message ||
            "Unable to create your account. Please try again.",
        );
      } else {
        setSignupError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center w-full bg-primary">
      <View className="flex-1 items-center w-full pb-12 border">
        {mode === "login" ? (
          <ImageBackground
            source={images.loginBg}
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

            <View className="flex-row items-center justify-center gap-2 mt-20">
              <Image
                source={icons.logo}
                className="size-16"
                resizeMode="contain"
              />
            </View>
            <View className="px-5 mt-16">
              <Text className="font-semibold text-2xl text-white text-left">
                Welcome Back !
              </Text>
              <Text className="text-gray-400 mt-2 text-left">
                Login to continue your movie journey
              </Text>
            </View>

            <View className="w-full px-5 mt-10">
              <Text className="text-white/90 text-base mt-8 text-left">
                Email
              </Text>

              <InputBox
                placeholder="Enter your email"
                type="email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setEmailError("");
                }}
              />

              {emailError ? (
                <Text className="text-red-400 text-sm mt-2">{emailError}</Text>
              ) : null}

              <Text className="text-white/90 text-base mt-8 text-left">
                Password
              </Text>

              <PasswordInput
                placeholder="Enter your password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setPasswordError("");
                }}
                error={passwordError}
              />
              <Text className="text-accent mt-4 text-right">
                Forgot Password?
              </Text>

              {formError ? (
                <View className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mt-6">
                  <Text className="text-red-400 text-sm">{formError}</Text>
                </View>
              ) : null}

              <TouchableOpacity onPress={handleLogin}>
                <View className="w-full h-16 bg-accent rounded-xl overflow-hidden mt-8 items-center justify-center">
                  <ImageBackground
                    source={images.highlight}
                    className="aboslute left-[-3] flex-row w-full h-auto items-center justify-center gap-2 py-5 px-3"
                    resizeMode="cover"
                  >
                    {loading ? (
                      <ActivityIndicator size={"large"} color={"#030014"} />
                    ) : (
                      <Text className="text-primary text-lg font-bold">
                        Login
                      </Text>
                    )}
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-center mt-4">
              <Text className="text-white/90 text-base mt-10 text-center">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => setMode("signup")}
                className="mt-9"
              >
                <Text className="text-accent">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <>
            <ScrollView
              className="flex-1 w-full"
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            >
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

                <Image
                  source={icons.logo}
                  className="w-12 h-10 self-center mt-20"
                />

                <View className="px-5 mt-20">
                  <Text className="font-semibold text-2xl text-white text-left">
                    Create Account
                  </Text>
                  <Text className="text-gray-400 mt-2 text-left">
                    Sign up to discover amazing movie
                  </Text>
                </View>

                <View className="w-full px-5 mt-10">
                  <Text className="text-white/90 text-base mt-8 text-left">
                    Full Name
                  </Text>

                  <InputBox
                    placeholder="Enter your name"
                    type={"name"}
                    value={name}
                    onChangeText={setName}
                  />

                  <Text className="text-white/90 text-base mt-8 text-left">
                    Email
                  </Text>

                  <InputBox
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChangeText={setEmail}
                  />

                  <Text className="text-white/90 text-base mt-8 text-left">
                    Password
                  </Text>

                  <PasswordInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    error={passwordError}
                  />

                  <Text className="text-white/90 text-base mt-8 text-left">
                    Confirm Password
                  </Text>

                  <PasswordInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={passwordError}
                  />
                  {signupError ? (
                    <View className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mt-6">
                      <Text className="text-red-400 text-sm">
                        {signupError}
                      </Text>
                    </View>
                  ) : null}
                  <TouchableOpacity onPress={handleSignup}>
                    <View className="w-full h-16 bg-accent rounded-xl mt-8 items-center justify-center overflow-hidden">
                      <ImageBackground
                        source={images.highlight}
                        className="aboslute left-[-3] flex-row w-full h-auto items-center justify-center gap-2 py-5 px-3"
                        resizeMode="cover"
                      >
                        {loading ? (
                          <ActivityIndicator size={"large"} color={"#030014"} />
                        ) : (
                          <Text className="text-primary text-lg font-bold">
                            Sign Up
                          </Text>
                        )}
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-center mt-4">
                  <Text className="text-white/90 text-base mt-4 text-center">
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setMode("login")}
                    className="mt-3"
                  >
                    <Text className="text-accent">Login</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

export default Login;
