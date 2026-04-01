import { http } from "../../../services/http";
import { getToken, setToken, removeToken } from "../../../services/tokenStorage";
import type {
  AuthResponse,
  LoginPayload,
  MeResponse,
  RegisterPayload,
} from "../types/auth_types";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await http<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setToken(data.access_token);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await http<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setToken(data.access_token);
    return data;
  },

  async getMe(): Promise<MeResponse> {
    return http<MeResponse>("/api/auth/me", {
      method: "GET",
    });
  },

  async logoutRemote(): Promise<void> {
    const token = getToken();

    if (!token) {
      return;
    }

    await http<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  logoutLocal(): void {
    removeToken();
  },

  logout(): void {
    removeToken();
  },
};