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

export interface RemainingMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealFoodEntry {
  id: number;
  meal_id: number;
  food_id: number;
  food_name: string;
  food_brand: string | null;
  grams: number;
  consumed_calories: number;
  consumed_protein: number;
  consumed_carbs: number;
  consumed_fat: number;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: number;
  daily_nutrition_log_id: number;
  name: string;
  meal_order: number;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  created_at: string;
  updated_at: string;
  entries: MealFoodEntry[];
}

export interface DailyNutritionLog {
  id: number;
  user_id: number;
  log_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  created_at: string;
  updated_at: string;
  meals: Meal[];
}

export interface GetDailyLogResponse {
  log: DailyNutritionLog;
  goal: NutritionGoal | null;
  remaining: RemainingMacros | null;
}

export interface CreateMealPayload {
  date: string;
  name: string;
  meal_order?: number;
}

export interface UpdateMealPayload {
  name?: string;
  meal_order?: number;
}

export interface CreateEntryPayload {
  food_id: number;
  grams: number;
}

export interface UpdateEntryPayload {
  food_id?: number;
  grams?: number;
}

export interface CreateMealResponse {
  message: string;
  meal: Meal;
}

export interface UpdateMealResponse {
  message: string;
  meal: Meal;
}

export interface CreateEntryResponse {
  message: string;
  entry: MealFoodEntry;
}

export interface UpdateEntryResponse {
  message: string;
  entry: MealFoodEntry;
}

export interface DeleteResponse {
  message: string;
}
