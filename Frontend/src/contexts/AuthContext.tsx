import { getToken } from "@/utils/tokenStorage";
import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
}

const noopSetUser: React.Dispatch<React.SetStateAction<User | null>> = () => {};
const noopSetToken: React.Dispatch<React.SetStateAction<string | null>> = () => {};

const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  setUser: noopSetUser,
  setToken: noopSetToken,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
