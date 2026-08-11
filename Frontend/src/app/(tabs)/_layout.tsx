import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "../../../constants/images";
import { icons } from "../../../constants/icons";

const TabIcon = ({
  focused,
  name,
  icon,
  customSize,
}: {
  focused: boolean;
  name: string;
  icon: any;
  customSize?: number;
}) => {
  return (
    focused ? (
    <ImageBackground source={images.highlight} className="flex flex-row w-full min-w-[95px] min-h-[52px] mt-4 overflow-hidden rounded-full flex-1 items-center justify-center">
      <Image source={icon} tintColor="#151312" className={`size-${customSize || 5}`}/>
      <Text className="text-secondary text-base font-semibold ml-2"> {name} </Text>
    </ImageBackground>
    ) : (
    <View className="size-full mt-4 rounded-full flex items-center justify-center">
      <Image source={icon} tintColor="#A8B5DB" className={`size-${customSize || 5}`}/>
    </View>
    )
  );
};

const _layout = () => {
  return (
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        tabBarStyle: {
            backgroundColor: "#0f0d23",
            borderRadius: 50,
            marginHorizontal: 10,
            paddingHorizontal: 10,
            marginBottom: 36,
            width: "95%",
            height: 52,
            position: "absolute",
            overflow: "hidden",
            borderColor: "transparent",  
        }
        }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="Home" icon={icons.home}/>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="Search" icon={icons.search} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="Explore" icon={icons.discover} customSize={5}/>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="Saved" icon={icons.save} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="Profile" icon={icons.person} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
