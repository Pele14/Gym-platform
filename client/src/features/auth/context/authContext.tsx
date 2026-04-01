import { createContext, useEffect, useMemo, useState } from "react";
import { getToken } from "../../../services/tokenStorage";
import { authService } from "../services/authService";
import type {
  AuthContextType,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth_types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!user;

  const refreshUser = async (): Promise<void> => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      authService.logoutLocal();
      setUser(null);
    }
  };

  const login = async (payload: LoginPayload): Promise<void> => {
    const data = await authService.login(payload);
    setUser(data.user);
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    const data = await authService.register(payload);
    setUser(data.user);
  };

  const logout = (): void => {
    void authService.logoutRemote().catch(() => {
      // Non-blocking: local logout must always succeed even if backend request fails.
    });
    authService.logoutLocal();
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}