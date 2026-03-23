import { http } from "../../../services/http";
import type {
  CalculateNutritionGoalResponse,
  GetNutritionGoalResponse,
} from "../types/nutrition_types";

export const nutritionService = {
  async getNutritionGoal(): Promise<GetNutritionGoalResponse> {
    return http<GetNutritionGoalResponse>("/api/nutrition/goal", {
      method: "GET",
    });
  },

  async calculateNutritionGoal(): Promise<CalculateNutritionGoalResponse> {
    return http<CalculateNutritionGoalResponse>("/api/nutrition/goal/calculate", {
      method: "POST",
    });
  },
};
