"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getFromLocalStorage,
  USER_KEY,
  removeFromLocalStorage,
  saveToLocalStorage,
  tokenKey,
} from "@/lib/localStorage";
import { User } from "@/types/api";
import { authApi, ProfileApi } from "@/services/api";
import { useRouter } from "next/navigation";
import { InterestService } from "@/services/api/interest";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  getUserData: (token: string) => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = await getFromLocalStorage(tokenKey);
        const storedUser = await getFromLocalStorage(USER_KEY);

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {

            const user: User = JSON.parse(storedUser);
            if (user.user.is_active) {
              setUser(user);
            } else {
              setUser(user);
              router.push("/opt-verify");
            }
          } else {
            getUserData(storedToken);
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    setToken(newToken);
    saveToLocalStorage(tokenKey, newToken);

    // Set cookie that will be used by middleware max-age=400 days max-age in seconds
    document.cookie = `${tokenKey}=${newToken}; path=/; max-age=34560000; SameSite=Strict`;
    try {
      const response = await ProfileApi.getProfile(newToken);
      setUser(response);
      if (!response.user.is_active) {
        router.push("/opt-verify");
        return;
      }
      // If we have a stored post-login destination, honor it first
      try {
        const returnTo = typeof window !== 'undefined' ? localStorage.getItem('auth_return_to') : null;
        if (returnTo) {
          saveToLocalStorage(USER_KEY, JSON.stringify(response));
          localStorage.removeItem('auth_return_to');
          router.push(returnTo);
          return;
        }
      } catch (e) {
        // ignore storage errors
      }
      // Check if user has any interests
      const interests = await InterestService.getInterests(newToken);
      if (
        interests &&
        (!interests?.segment || interests.segment.length === 0)
      ) {
        // First time user - redirect to pick interests
        router.push("/pick-interest");
      } else {
        // Existing user with interests - save user data and redirect to home
        saveToLocalStorage(USER_KEY, JSON.stringify(response));
        router.push("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error appropriately
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeFromLocalStorage(tokenKey);
    removeFromLocalStorage(USER_KEY);
    authApi.logout(token!);
    // Remove the cookie
    document.cookie = `${tokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; secure`;
  }
  const getUserData = async (token: string) => {
    const response = await ProfileApi.getProfile(token);

    setUser(response);
    saveToLocalStorage(USER_KEY, JSON.stringify(response));
    return response;
  };

  const value = {
    isAuthenticated: !!token && !!document.cookie.includes(tokenKey),
    isLoading,
    token,
    login,
    logout,
    user,
    setUser,
    getUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
