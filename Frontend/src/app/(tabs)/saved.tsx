import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import CollectionCard from "@/components/saved/CollectionCard";
import PromoBanner from "@/components/saved/PromoBanner";

import { useState, useEffect } from "react";
import { getMovieInteractionByType } from "@/api/movieInteractionApi";
import { router } from "expo-router";
import { images } from "../../../constants/images";
import { useAuth } from "@/contexts/AuthContext";
import { useMovieInteraction } from "@/contexts/MovieInteractionContext";

type CollectionType = "watched" | "favorite" | "watchlist";

type SavedCollections = Record<CollectionType, Movie[]>;

const SavedScreen = () => {
  const { getCollection, loading } = useMovieInteraction();

const watchedMovies = getCollection("watched");
const favoriteMovies = getCollection("favorite");
const watchlistMovies = getCollection("watchlist");
  const [error, setError] = useState<Error | null>(null);
  const collectionConfig = [
    {
      key: "watched" as const,
      title: "Watched",
      subtitle: "Movies you've finished",
      icon: "checkmark-done" as const,
    },
    {
      key: "favorite" as const,
      title: "Favorites",
      subtitle: "Movies you love",
      icon: "heart" as const,
    },
    {
      key: "watchlist" as const,
      title: "Watchlist",
      subtitle: "Movies to watch later",
      icon: "list" as const,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#030014] pb-20">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text className="text-white text-center mt-10">{error?.message}</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
        >
          {/* Header */}

          <View className="px-5 pt-4">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-[36px] font-bold text-white">Saved</Text>

                <Text className="mt-1 text-[15px] text-[#8E8B98]">
                  Your personal collections
                </Text>
              </View>

              <Pressable
                className="
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                border-[#221C36]
                bg-[#090615]
              "
              >
                <Ionicons name="search" size={22} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Collection Cards */}

          <View className="mt-8 px-5">
            
              <CollectionCard
                key={collectionConfig[0].key}
                title={collectionConfig[0].title}
                subtitle={collectionConfig[0].subtitle}
                icon={collectionConfig[0].icon}
                movieCount={watchedMovies.length}
                movies={watchedMovies.slice(0, 4)}
                pageType={collectionConfig[0].key}
              />

              <CollectionCard
                key={collectionConfig[1].key}
                title={collectionConfig[1].title}
                subtitle={collectionConfig[1].subtitle}
                icon={collectionConfig[1].icon}
                movieCount={favoriteMovies.length}
                movies={favoriteMovies.slice(0, 4)}
                pageType={collectionConfig[1].key}
              />

              <CollectionCard
                key={collectionConfig[2].key}
                title={collectionConfig[2].title}
                subtitle={collectionConfig[2].subtitle}
                icon={collectionConfig[2].icon}
                movieCount={watchlistMovies.length}
                movies={watchlistMovies.slice(0, 4)}
                pageType={collectionConfig[2].key}
              />

            <PromoBanner />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SavedScreen;
