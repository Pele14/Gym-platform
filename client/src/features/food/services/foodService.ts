import { http } from "../../../services/http";
import type {
  CreateFoodPayload,
  FoodResponse,
  GetFoodResponse,
  GetFoodsResponse,
  UpdateFoodPayload,
} from "../types/food_types";

export const foodService = {
  async getFoods(): Promise<GetFoodsResponse> {
    return http<GetFoodsResponse>("/api/foods", {
      method: "GET",
    });
  },

  async getFoodById(foodId: number): Promise<GetFoodResponse> {
    return http<GetFoodResponse>(`/api/foods/${foodId}`, {
      method: "GET",
    });
  },

  async createSystemFood(payload: CreateFoodPayload): Promise<FoodResponse> {
    return http<FoodResponse>("/api/foods/system", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async createCustomFood(payload: CreateFoodPayload): Promise<FoodResponse> {
    return http<FoodResponse>("/api/foods/custom", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateSystemFood(
    foodId: number,
    payload: UpdateFoodPayload
  ): Promise<FoodResponse> {
    return http<FoodResponse>(`/api/foods/system/${foodId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async updateCustomFood(
    foodId: number,
    payload: UpdateFoodPayload
  ): Promise<FoodResponse> {
    return http<FoodResponse>(`/api/foods/custom/${foodId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteSystemFood(foodId: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/foods/system/${foodId}`, {
      method: "DELETE",
    });
  },

  async deleteCustomFood(foodId: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/foods/custom/${foodId}`, {
      method: "DELETE",
    });
  },
};