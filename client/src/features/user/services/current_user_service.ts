import { http } from "../../../services/http";
import type {
  GetCurrentUserResponse,
  UpdateCurrentUserPayload,
  UpdateCurrentUserResponse,
} from "../types/currentUser";

export const currentUserService = {
  async getMe(): Promise<GetCurrentUserResponse> {
    return http<GetCurrentUserResponse>("/api/users/me", {
      method: "GET",
    });
  },

  async updateMe(
    payload: UpdateCurrentUserPayload
  ): Promise<UpdateCurrentUserResponse> {
    return http<UpdateCurrentUserResponse>("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};