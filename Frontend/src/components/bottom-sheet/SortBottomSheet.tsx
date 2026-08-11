import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { BackHandler, Text, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";

type SortBottomSheetProps = {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
};

const SortBottomSheet = forwardRef<BottomSheetModal, SortBottomSheetProps>(
  ({ sortBy, setSortBy }, ref) => {
    const insets = useSafeAreaInsets();
    const [isOpen, setIsOpen] = useState(false);
    useBottomSheetBackHandler(ref as React.RefObject<BottomSheetModal | null>, isOpen);

    const snapPoints = useMemo(() => ["65%"], []);

    const closeSheet = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.dismiss();
      }
    };

    const handleSort = (value: string) => {
      setSortBy(value);
      closeSheet();
    };

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
        backdropComponent={(props: BottomSheetBackdropProps) => (
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
          className="flex-1 bg-[#030014] px-5 pt-3"
          style={{
            paddingBottom: insets.bottom + 16,
          }}
        >
          {/* Header */}
          <View className="mb-7 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[26px] font-bold text-white">
                Sort Movies
              </Text>

              <Text className="mt-1 text-[14px] text-[#85818F]">
                Choose how you want to view movies
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={closeSheet}
              className="
                ml-4
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
              <Ionicons name="close" size={21} color="#AAA6B4" />
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View className="gap-3">
            {/* Most Popular */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSort("popularity.desc")}
              className={`
                flex-row
                items-center
                rounded-2xl
                border
                p-4
                ${
                  sortBy === "popularity.desc"
                    ? "border-[#AB8BFF] bg-[#0E0A1A]"
                    : "border-[#241C40] bg-[#090615]"
                }
              `}
            >
              <View
                className={`
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    sortBy === "popularity.desc"
                      ? "bg-[#130D25]"
                      : "bg-[#110D1C]"
                  }
                `}
              >
                <Ionicons
                  name="flame-outline"
                  size={22}
                  color={sortBy === "popularity.desc" ? "#AB8BFF" : "#85818F"}
                />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-[16px] font-semibold text-white">
                  Most Popular
                </Text>

                <Text className="mt-1 text-[13px] text-[#85818F]">
                  Popular movies first
                </Text>
              </View>

              {sortBy === "popularity.desc" && (
                <Ionicons name="checkmark-circle" size={24} color="#AB8BFF" />
              )}
            </TouchableOpacity>

            {/* Highest Rated */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSort("vote_average.desc")}
              className={`
                flex-row
                items-center
                rounded-2xl
                border
                p-4
                ${
                  sortBy === "vote_average.desc"
                    ? "border-[#AB8BFF] bg-[#0E0A1A]"
                    : "border-[#241C40] bg-[#090615]"
                }
              `}
            >
              <View
                className="
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#110D1C]
                "
              >
                <Ionicons
                  name="star-outline"
                  size={22}
                  color={sortBy === "vote_average.desc" ? "#AB8BFF" : "#85818F"}
                />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-[16px] font-semibold text-white">
                  Highest Rated
                </Text>

                <Text className="mt-1 text-[13px] text-[#85818F]">
                  Best rated movies first
                </Text>
              </View>

              {sortBy === "vote_average.desc" && (
                <Ionicons name="checkmark-circle" size={24} color="#AB8BFF" />
              )}
            </TouchableOpacity>

            {/* Newest */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSort("primary_release_date.desc")}
              className={`
                flex-row
                items-center
                rounded-2xl
                border
                p-4
                ${
                  sortBy === "primary_release_date.desc"
                    ? "border-[#AB8BFF] bg-[#0E0A1A]"
                    : "border-[#241C40] bg-[#090615]"
                }
              `}
            >
              <View
                className="
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#110D1C]
                "
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={
                    sortBy === "primary_release_date.desc"
                      ? "#AB8BFF"
                      : "#85818F"
                  }
                />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-[16px] font-semibold text-white">
                  Newest
                </Text>

                <Text className="mt-1 text-[13px] text-[#85818F]">
                  Recently released movies first
                </Text>
              </View>

              {sortBy === "primary_release_date.desc" && (
                <Ionicons name="checkmark-circle" size={24} color="#AB8BFF" />
              )}
            </TouchableOpacity>

            {/* Oldest */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSort("primary_release_date.asc")}
              className={`
                flex-row
                items-center
                rounded-2xl
                border
                p-4
                ${
                  sortBy === "primary_release_date.asc"
                    ? "border-[#AB8BFF] bg-[#0E0A1A]"
                    : "border-[#241C40] bg-[#090615]"
                }
              `}
            >
              <View
                className="
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#110D1C]
                "
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={
                    sortBy === "primary_release_date.asc"
                      ? "#AB8BFF"
                      : "#85818F"
                  }
                />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-[16px] font-semibold text-white">
                  Oldest
                </Text>

                <Text className="mt-1 text-[13px] text-[#85818F]">
                  Classic movies first
                </Text>
              </View>

              {sortBy === "primary_release_date.asc" && (
                <Ionicons name="checkmark-circle" size={24} color="#AB8BFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Current Selection */}
          <View className="mt-6 items-center">
            <Text className="text-[13px] text-[#656171]">Current sorting</Text>

            <Text className="mt-1 text-[14px] font-medium text-[#AB8BFF]">
              {sortBy === "popularity.desc"
                ? "Most Popular"
                : sortBy === "vote_average.desc"
                  ? "Highest Rated"
                  : sortBy === "primary_release_date.desc"
                    ? "Newest"
                    : "Oldest"}
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

SortBottomSheet.displayName = "SortBottomSheet";

export default SortBottomSheet;
