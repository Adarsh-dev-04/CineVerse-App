import React, { useMemo, useState } from "react";

import {
  ScrollView,
  Text,
  View,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import RatingStars from "@/components/review/RatingStars";
import ReviewInput from "@/components/review/ReviewInput";
import FeatureChip from "@/components/review/FeatureChip";
import BenefitCard from "@/components/review/BenefitCard";
import SubmitButton from "@/components/review/SubmitButton";

import { patchReview, getReview } from "@/api/appReviewApi";

import { reviewTags, reviewBenefits } from "@/constants/ReviewData";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function RateAppScreen() {
  const{ user } = useAuth();
  const{ showLoginSheet } =useBottomSheet();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [review, setReview] = useState("");

  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const messages = useMemo(
    () => ({
      0: {
        emoji: "⭐",
        title: "Rate CineVerse",
        subtitle: "How has your movie discovery experience been so far?",
      },

      1: {
        emoji: "😔",
        title: "We're sorry",
        subtitle: "Tell us what went wrong. We'll do our best to improve.",
      },

      2: {
        emoji: "🙂",
        title: "Thanks for your honesty",
        subtitle: "Your feedback helps us make CineVerse better.",
      },

      3: {
        emoji: "😊",
        title: "Thanks!",
        subtitle: "What could make your experience even better?",
      },

      4: {
        emoji: "✨",
        title: "Almost Perfect!",
        subtitle: "We're glad you're enjoying CineVerse.",
      },

      5: {
        emoji: "🎉",
        title: "Awesome!",
        subtitle: "Thanks for supporting CineVerse.",
      },
    }),
    [],
  );

  const current = messages[rating as keyof typeof messages];

  const toggleTag = (id: number) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((item) => item !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      if(!user){
        showLoginSheet('Login required','user');
        return;
      }
      setLoading(true);
      const response = await patchReview({
        rating: rating,
        review: review,
        tags: selectedTags,
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#030014]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        {/* HEADER */}

        <View className="flex-row items-center justify-between px-5 pt-3">
          <Pressable
            className="h-12 w-12 items-center justify-center rounded-full border border-[#241C40] bg-[#090615]"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="white" />
          </Pressable>

          <View className="w-12" />
        </View>

        {/* HERO */}

        <View className="items-center px-4">
          <View className="relative w-full h-52">
            <View className="">
              <Text className="text-white text-2xl font-bold pt-5">
                Enjoying MovieFlix?
              </Text>
              <Text className="text-accent text-2xl font-bold">
                We'd love your review!
              </Text>
              <Text className="text-wrap w-60 text-base mt-2 text-gray-400">
                Your feedback help us improving the app and bring you the best
                experience
              </Text>
            </View>

            <Image
              source={require("@/assets/review-phone.png")}
              resizeMode="cover"
              className="h-64 w-56 absolute right-[-20]"
            />
          </View>

          <RatingStars rating={rating} onChange={setRating} />
        </View>
        {rating > 0 && (
          <View className="mx-5 mt-8 rounded-[28px] border border-[#241C40] bg-[#090615] p-6">
            <Text className="text-center text-[44px]">{current.emoji}</Text>

            <Text className="mt-3 text-center text-[28px] font-bold text-white">
              {current.title}
            </Text>

            <Text className=" mt-2 text-center text-[15px] leading-6 text-[#9894A4]">
              {current.subtitle}
            </Text>
          </View>
        )}
        <ReviewInput value={review} onChangeText={setReview} />
        <View className="mt-8 px-5">
          <Text className="mb-5 text-xl font-semibold text-white">
            What did you like?
          </Text>

          <View className="flex-row flex-wrap">
            {reviewTags.map((tag) => (
              <FeatureChip
                key={tag.id}
                title={tag.title}
                icon={tag.icon as any}
                selected={selectedTags.includes(tag.id)}
                onPress={() => toggleTag(tag.id)}
              />
            ))}
          </View>
        </View>
        <View className="mt-8 px-5">
          <View
            className="
            overflow-hidden
            rounded-[28px]
            w-full
            border
            border-[#241C40]
            bg-[#090615]
            "
          >
            {reviewBenefits.map((item, index) => (
              <React.Fragment key={item.id}>
                <BenefitCard
                  title={item.title}
                  description={item.description}
                  icon={item.icon as any}
                />

                {index !== reviewBenefits.length - 1 && (
                  <View className="h-px bg-[#241C40]" />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
        <View className="px-5">
          <SubmitButton
            disabled={rating === 0}
            onPress={handleRatingSubmit}
          />
        </View>
        <Text
          className="
          mt-8
          px-10
          text-center
          text-sm
          leading-6
          text-[#6C6584]
          "
        >
          Your feedback helps improve CineVerse for everyone. Thank you for
          taking the time to share your thoughts.
        </Text>

        <Modal
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => {
            (setShowSuccessModal(false), router.push("/(tabs)"));
          }}
          animationType="none"
        >
          <View className="flex-1 justify-center items-center bg-black/70">
            <View className="bg-[#090615] border border-gray-600/50 flex justify-center items-center mx-5 rounded-3xl px-5 py-8">
              <View className="flex-row items-center mb-4">
                <View className="rounded-full flex-row items-center justify-center">
                  <Ionicons
                    name="heart"
                    color={"#ef4444"}
                    size={25}
                    className="mx-auto my-auto"
                  />
                </View>
                <Text className="text-2xl text-white font-bold">Thank you</Text>
              </View>

              <Text className="text-white/40 text-lg text-center">
                for taking the time to share your thoughts. Your feedback helps
                improve CineVerse for everyone.
              </Text>
              <TouchableOpacity
                className="px-4 py-3 bg-accent rounded-xl mt-4"
                onPress={() => {
                  (setShowSuccessModal(false), router.push("/(tabs)"));
                }}
              >
                <Text className="text-primary text-lg text-center font-bold">
                  Exlore More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
