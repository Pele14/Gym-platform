export { nutritionService } from "./services/nutritionService";
export { useNutritionGoal } from "./hooks/useNutritionGoal";
export { default as NutritionGoalCard } from "./components/nutritionGoalCard";

export type {
  NutritionGoal,
  GetNutritionGoalResponse,
  CalculateNutritionGoalResponse,
} from "./types/nutrition_types";
