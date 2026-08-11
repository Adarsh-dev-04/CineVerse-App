import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";

type FilterBottomSheetProps = {
  selectedGenre: number | null;
  setSelectedGenre: Dispatch<SetStateAction<number | null>>;

  selectedYear: number | null;
  setSelectedYear: Dispatch<SetStateAction<number | null>>;

  selectedRating: number | null;
  setSelectedRating: Dispatch<SetStateAction<number | null>>;

  selectedLanguage: string | null;
  setSelectedLanguage: Dispatch<SetStateAction<string | null>>;



  onApply: () => void;
  genrePage?:boolean
};

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019,2018, 2017];

const ratings = [{ value: 9, label: "9+" }, { value: 8, label: "8+" },{ value: 7, label: "7+" }, { value: 6, label: "6+" }, { value: 5, label: "5+" },];

const languages = [{ value: "en", label: "English" }, { value: "hi", label: "Hindi" }, { value: "ja", label: "Japanese" }, { value: "ko", label: "Korean" }, { value: "fr", label: "French" }, { value: "es", label: "Spanish" },];

const FilterBottomSheet = forwardRef<
  BottomSheetModal,
  FilterBottomSheetProps
>(
  (
    {
      selectedGenre,
      setSelectedGenre,

      selectedYear,
      setSelectedYear,

      selectedRating,
      setSelectedRating,

      selectedLanguage,
      setSelectedLanguage,

      onApply,
      genrePage=false
    },
    ref
  ) => {
    const insets = useSafeAreaInsets();
    const [isOpen, setIsOpen] = useState(false);
    useBottomSheetBackHandler(ref as React.RefObject<BottomSheetModal | null>, isOpen);

    const snapPoints = useMemo(() => ["85%"], []);

    const closeSheet = () => {
      if (
        ref &&
        typeof ref !== "function" &&
        ref.current
      ) {
        ref.current.dismiss();
      }
    };

    const resetFilters = () => {
      genrePage? '' : setSelectedGenre(null);
      setSelectedYear(null);
      setSelectedRating(null);
      setSelectedLanguage(null);
    };

    const applyFilters = () => {
      onApply();
      closeSheet();
    };

    const hasFilters =
      genrePage?'':selectedGenre !== null ||
      selectedYear !== null ||
      selectedRating !== null ||
      selectedLanguage !== null;

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDismissOnClose
        onChange={(index) => {
          setIsOpen(index >= 0);
        }}
        onDismiss={() => {
          setIsOpen(false);
        }}
        backgroundStyle={{
          backgroundColor: "#030014",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        handleIndicatorStyle={{
          backgroundColor: "#3A344A",
          width: 42,
          height: 5,
        }}
        backdropComponent={(
          props: BottomSheetBackdropProps
        ) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.65}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView
          className="flex-1 bg-[#030014]"
          style={{
            paddingBottom: insets.bottom,
          }}
        >
          {/* Header */}

          <View className="flex-row items-center justify-between px-5 pb-5 pt-3">
            <View>
              <Text className="text-[26px] font-bold text-white">
                Filter Movies
              </Text>

              <Text className="mt-1 text-[14px] text-[#85818F]">
                Refine your movie results
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={closeSheet}
              className="
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#241C40]
                bg-[#090615]
              "
            >
              <Ionicons
                name="close"
                size={21}
                color="#AAA6B4"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 30,
            }}
          >
            {/* GENRE */}
            {genrePage ? '' : 
            <View className="mt-2">
              <Text className="mb-4 text-[17px] font-semibold text-white">
                Genre
              </Text>

              <View className="flex-row flex-wrap">
                { genres.map((genre) => {
                  const active =
                    selectedGenre === genre.id;

                  return (
                    <TouchableOpacity
                      key={genre.id}
                      activeOpacity={0.8}
                      onPress={() =>
                        setSelectedGenre(
                          active ? null : genre.id
                        )
                      }
                      className={`
                        mb-3
                        mr-2
                        rounded-full
                        border
                        px-4
                        py-2.5
                        ${
                          active
                            ? "border-[#AB8BFF] bg-[#130D25]"
                            : "border-[#241C40] bg-[#090615]"
                        }
                      `}
                    >
                      <Text
                        className={
                          active
                            ? "font-medium text-[#AB8BFF]"
                            : "font-medium text-[#9B97A8]"
                        }
                      >
                        {genre.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>}

            {/* YEAR */}

            <View className="mt-7">
              <Text className="mb-4 text-[17px] font-semibold text-white">
                Release Year
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {years.map((year) => {
                  const active =
                    selectedYear === year;

                  return (
                    <TouchableOpacity
                      key={year}
                      activeOpacity={0.8}
                      onPress={() =>
                        setSelectedYear(
                          active ? null : year
                        )
                      }
                      className={`
                        mr-2
                        rounded-xl
                        border
                        px-5
                        py-3
                        ${
                          active
                            ? "border-[#AB8BFF] bg-[#130D25]"
                            : "border-[#241C40] bg-[#090615]"
                        }
                      `}
                    >
                      <Text
                        className={
                          active
                            ? "font-semibold text-[#AB8BFF]"
                            : "font-medium text-[#9B97A8]"
                        }
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* RATING */}

            <View className="mt-7">
              <Text className="mb-4 text-[17px] font-semibold text-white">
                Minimum Rating
              </Text>

              <View className="flex-row flex-wrap">
                {ratings.map((rating) => {
                  const active =
                    selectedRating === rating.value;

                  return (
                    <TouchableOpacity
                      key={rating.value}
                      activeOpacity={0.8}
                      onPress={() =>
                        setSelectedRating(
                          active
                            ? null
                            : rating.value
                        )
                      }
                      className={`
                        mr-3
                        rounded-xl
                        border
                        px-5
                        py-3
                        ${
                          active
                            ? "border-[#AB8BFF] bg-[#130D25]"
                            : "border-[#241C40] bg-[#090615]"
                        }
                      `}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name="star"
                          size={15}
                          color={
                            active
                              ? "#AB8BFF"
                              : "#777181"
                          }
                        />

                        <Text
                          className={`
                            ml-2
                            font-semibold
                            ${
                              active
                                ? "text-[#AB8BFF]"
                                : "text-[#9B97A8]"
                            }
                          `}
                        >
                          {rating.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* LANGUAGE */}

            <View className="mt-7">
              <Text className="mb-4 text-[17px] font-semibold text-white">
                Language
              </Text>

              <View className="flex-row flex-wrap">
                {languages.map((language) => {
                  const active =
                    selectedLanguage ===
                    language.value;

                  return (
                    <TouchableOpacity
                      key={language.value}
                      activeOpacity={0.8}
                      onPress={() =>
                        setSelectedLanguage(
                          active
                            ? null
                            : language.value
                        )
                      }
                      className={`
                        mb-3
                        mr-2
                        rounded-full
                        border
                        px-4
                        py-2.5
                        ${
                          active
                            ? "border-[#AB8BFF] bg-[#130D25]"
                            : "border-[#241C40] bg-[#090615]"
                        }
                      `}
                    >
                      <Text
                        className={
                          active
                            ? "font-medium text-[#AB8BFF]"
                            : "font-medium text-[#9B97A8]"
                        }
                      >
                        {language.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}

          <View
            className="
              flex-row
              items-center
              border-t
              border-[#171329]
              bg-[#030014]
              px-5
              pt-4
            "
            style={{
              paddingBottom: insets.bottom + 4,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={resetFilters}
              className="
                mr-3
                h-14
                flex-1
                items-center
                justify-center
                rounded-2xl
                border
                border-[#241C40]
                bg-[#090615]
              "
            >
              <Text className="font-semibold text-[#9B97A8]">
                Reset
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={applyFilters}
              className="
                h-14
                flex-[1.5]
                flex-row
                items-center
                justify-center
                rounded-2xl
                bg-[#AB8BFF]
              "
            >
              <Text className="font-bold text-[#030014]">
                Apply Filters
              </Text>

              {hasFilters && (
                <View className="ml-2 rounded-full bg-[#030014]/20 px-2 py-0.5">
                  <Text className="text-xs font-bold text-[#030014]">
                    {[
                      selectedGenre,
                      selectedYear,
                      selectedRating,
                      selectedLanguage,
                    ].filter(Boolean).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

FilterBottomSheet.displayName =
  "FilterBottomSheet";

export default FilterBottomSheet;