import { createContext, useContext, useRef, useState, ReactNode } from "react";

import { useRouter } from "expo-router";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LoginBottomSheet from "@/components/bottom-sheet/LoginBottomSheet";

type LoginSheetMessage = string;
type LoginSheetIcon = 'bookmark'|'heart'|'user'|'edit';

type BottomSheetContextType = {
  loginSheetRef: React.RefObject<BottomSheetModal | null>;

  showLoginSheet: (message: LoginSheetMessage, icon:LoginSheetIcon) => void;

  hideLoginSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const loginSheetRef = useRef<BottomSheetModal>(null);

  const [message, setMessage] = useState<string>('');
  const [icon, setIcon] = useState<'bookmark'|'heart'|'user'|'edit'>('bookmark');

  const showLoginSheet = (message: LoginSheetMessage, icon: LoginSheetIcon) => {
    setMessage(message);
    setIcon(icon);
    loginSheetRef.current?.present();
  };

  const hideLoginSheet = () => {
    loginSheetRef.current?.dismiss();
  };

  const handleLogin = () => {
    hideLoginSheet();

    router.push({
      pathname: "/(tabs)/profile",
      params: {
        modeParam: "login",
      },
    });
  };

  const handleSignup = () => {
    hideLoginSheet();

    router.push({
      pathname: "/(tabs)/profile",
      params: {
        modeParam: "signup",
      },
    });
  };

  return (
    <BottomSheetContext.Provider
      value={{
        loginSheetRef,
        showLoginSheet,
        hideLoginSheet,
      }}
    >
      {children}

      <LoginBottomSheet
        ref={loginSheetRef}
        message={message}
        icon={icon}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error("useBottomSheet must be used inside BottomSheetProvider");
  }

  return context;
}
