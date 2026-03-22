export interface Food {
  id: number;
  name: string;
  brand: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  is_system: boolean;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface GetFoodsResponse {
  foods: Food[];
}

export interface GetFoodResponse {
  food: Food;
}

export interface FoodResponse {
  message?: string;
  food: Food;
}

export interface CreateFoodPayload {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UpdateFoodPayload {
  name?: string;
  brand?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}