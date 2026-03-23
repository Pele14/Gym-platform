export interface NutritionGoal {
  id: number;
  user_id: number;
  bmi: number;
  maintenance_calories: number;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  created_at: string;
  updated_at: string;
}

export interface GetNutritionGoalResponse {
  goal: NutritionGoal;
}

export interface CalculateNutritionGoalResponse {
  message: string;
  goal: NutritionGoal;
}
