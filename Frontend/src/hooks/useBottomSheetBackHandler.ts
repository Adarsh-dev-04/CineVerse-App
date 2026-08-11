import { useEffect } from "react";
import { BackHandler } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export const useBottomSheetBackHandler = (
  ref: React.RefObject<BottomSheetModal | null>,
  isOpen: boolean
) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          ref.current?.dismiss();

          return true;
        }
      );

    return () => subscription.remove();
  }, [isOpen, ref]);
};