import { http } from "../../../services/http";
import type { GetUsersResponse } from "../types/user";

export const userService = {
  async getUsers(): Promise<GetUsersResponse> {
    return http<GetUsersResponse>("/api/users", {
      method: "GET",
    });
  },
};