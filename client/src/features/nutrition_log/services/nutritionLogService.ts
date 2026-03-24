import { http } from "../../../services/http";
import type {
  GetDailyLogResponse,
  CreateMealPayload,
  CreateMealResponse,
  UpdateMealPayload,
  UpdateMealResponse,
  CreateEntryPayload,
  CreateEntryResponse,
  UpdateEntryPayload,
  UpdateEntryResponse,
  DeleteResponse,
} from "../types/nutrition_log_types";

export const nutritionLogService = {
  async getDailyLog(date: string): Promise<GetDailyLogResponse> {
    return http<GetDailyLogResponse>(`/api/nutrition/logs?date=${date}`, {
      method: "GET",
    });
  },

  async createMeal(payload: CreateMealPayload): Promise<CreateMealResponse> {
    return http<CreateMealResponse>("/api/nutrition/logs/meals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateMeal(
    mealId: number,
    payload: UpdateMealPayload
  ): Promise<UpdateMealResponse> {
    return http<UpdateMealResponse>(`/api/nutrition/logs/meals/${mealId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteMeal(mealId: number): Promise<DeleteResponse> {
    return http<DeleteResponse>(`/api/nutrition/logs/meals/${mealId}`, {
      method: "DELETE",
    });
  },

  async createEntry(
    mealId: number,
    payload: CreateEntryPayload
  ): Promise<CreateEntryResponse> {
    return http<CreateEntryResponse>(
      `/api/nutrition/logs/meals/${mealId}/entries`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  async updateEntry(
    mealId: number,
    entryId: number,
    payload: UpdateEntryPayload
  ): Promise<UpdateEntryResponse> {
    return http<UpdateEntryResponse>(
      `/api/nutrition/logs/meals/${mealId}/entries/${entryId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  async deleteEntry(
    mealId: number,
    entryId: number
  ): Promise<DeleteResponse> {
    return http<DeleteResponse>(
      `/api/nutrition/logs/meals/${mealId}/entries/${entryId}`,
      {
        method: "DELETE",
      }
    );
  },
};
