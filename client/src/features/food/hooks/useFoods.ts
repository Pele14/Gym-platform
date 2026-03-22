import { useCallback, useEffect, useState } from "react";
import { foodService } from "../services/foodService";
import type {
  CreateFoodPayload,
  Food,
  UpdateFoodPayload,
} from "../types/food_types";

export function useFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFoods = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await foodService.getFoods();
      setFoods(data.foods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load foods.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFoods();
  }, [fetchFoods]);

  const createFood = async (payload: CreateFoodPayload, isSystem: boolean) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = isSystem
        ? await foodService.createSystemFood(payload)
        : await foodService.createCustomFood(payload);

      setFoods((prev) => [...prev, data.food]);
      return data.food;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create food.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFood = async (
    foodId: number,
    payload: UpdateFoodPayload,
    isSystem: boolean
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = isSystem
        ? await foodService.updateSystemFood(foodId, payload)
        : await foodService.updateCustomFood(foodId, payload);

      setFoods((prev) =>
        prev.map((food) => (food.id === foodId ? data.food : food))
      );

      return data.food;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update food.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteFood = async (foodId: number, isSystem: boolean) => {
    try {
      setError(null);

      if (isSystem) {
        await foodService.deleteSystemFood(foodId);
      } else {
        await foodService.deleteCustomFood(foodId);
      }

      setFoods((prev) => prev.filter((food) => food.id !== foodId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete food.";
      setError(message);
      throw err;
    }
  };

  return {
    foods,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchFoods,
    createFood,
    updateFood,
    deleteFood,
  };
}