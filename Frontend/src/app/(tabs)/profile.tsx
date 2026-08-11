import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { ReactNode, useState } from "react";

import useAuth from "@/hooks/useAuth";

import { images } from "../../../constants/images";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

import { Link, RelativePathString, useLocalSearchParams, useRouter } from "expo-router";

import { removeToken} from "@/utils/tokenStorage";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoginSignup from "@/components/auth/LoginSignup";

const dummyUser = {
  name: "Adarsh",
  email: "dummyUser",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
};

const profile = () => {
  const { modeParam } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState(modeParam || "login");
  const { user, logout } = useAuth();

  
  async function handleLogout() {
    await removeToken();
    logout();
  }

  return (
    <View className="flex-1 items-center justify-center bg-primary">
      {user ? (
        <View className="flex-1 items-center w-full pb-12 border">
          <Image source={images.bg} className="absolute w-full" />
          <View className="flex-1 items-center mt-40 w-full">
            <View className="flex-row items-start justify-start w-full px-5 gap-8">
              <FontAwesome
                name="user-o"
                size={50}
                color="#A8B5DB"
                className="text-accent px-5 py-4  border-2 border-gray-400 rounded-full"
              />
              <View>
                <Text className="text-lg font-bold text-white mt-4">
                  {user.name}
                </Text>
                <Text className="text-gray-400">{user.email}</Text>
              </View>
            </View>
            <View className="w-full px-5 mt-10">
              <OptionButton title="Edit Profile" link="/pages/edit-profile">
                <MaterialCommunityIcons
                  name="account-edit"
                  size={24}
                  color="#A8B5DB"
                />
              </OptionButton>

              <OptionButton title="All Saved" link="/saved">
                <MaterialIcons name="bookmark" size={24} color="#A8B5DB" />
              </OptionButton>

              <OptionButton
                title="Watchlist"
                link="/movie-interaction/watchlist"
              >
                <FontAwesome5
                  name="clipboard-list"
                  size={20}
                  color={"#A8B5DB"}
                />
              </OptionButton>

              <OptionButton
                title="Watched"
                link="/movie-interaction/watched"
              >
                <MaterialIcons name="done" size={24} color="#A8B5DB" />
              </OptionButton>

              <OptionButton
                title="Favorite"
                link="/movie-interaction/favorite"
              >
                <Ionicons name="heart" size={20} color={"#A8B5DB"} />
              </OptionButton>

              <OptionButton title="Preferences" link="/pages/preferences">
                <Entypo name="sound-mix" size={24} color="#A8B5DB" />
              </OptionButton>

              <TouchableOpacity
                className="w-full h-16 bg-accent rounded-xl mt-4 items-center justify-center overflow-hidden"
                onPress={handleLogout}
              >
                <ImageBackground
                  source={images.highlight}
                  className="aboslute left-[-3] flex-row w-full h-auto items-center justify-center gap-2 py-5 px-3"
                  resizeMode="cover"
                >
                  <Text className="text-primary text-lg font-bold">Logout</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <LoginSignup mode={mode} setMode={setMode} email={email} setEmail={setEmail} name={name} setName={setName}/>
      )}
    </View>
  );
};

type OptionButtonProps = {
  title: string;
  link: string;
  pageName?: string;
  children: ReactNode;
};
function OptionButton({ title, link, pageName, children }: OptionButtonProps) {
  return (
    <Link href={link as RelativePathString} asChild>
      <TouchableOpacity className="w-full h-16 bg-[#0e1035] border border-gray-400/30 rounded-xl pl-4 flex-row items-start justify-start gap-4 mt-4">
        <View className="h-full w-12 items-center justify-center">
          {children}
        </View>
        <View className="w-11/12 h-full items-start justify-center">
          <Text className="text-white font-bold text-lg">{title}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default profile;
