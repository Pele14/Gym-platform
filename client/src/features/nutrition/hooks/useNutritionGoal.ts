import { useCallback, useEffect, useState } from "react";
import { nutritionService } from "../services/nutritionService";
import type { NutritionGoal } from "../types/nutrition_types";

const NOT_CALCULATED_MESSAGE = "Nutrition goal not found.";

export function useNutritionGoal() {
  const [goal, setGoal] = useState<NutritionGoal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notCalculatedYet, setNotCalculatedYet] = useState<boolean>(false);

  const fetchGoal = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await nutritionService.getNutritionGoal();
      setGoal(data.goal);
      setNotCalculatedYet(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load nutrition goal.";

      if (message === NOT_CALCULATED_MESSAGE) {
        setGoal(null);
        setNotCalculatedYet(true);
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGoal();
  }, [fetchGoal]);

  const calculateGoal = async () => {
    try {
      setIsCalculating(true);
      setError(null);

      const data = await nutritionService.calculateNutritionGoal();
      setGoal(data.goal);
      setNotCalculatedYet(false);

      return data.goal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to calculate nutrition goal.";
      setError(message);
      throw err;
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    goal,
    isLoading,
    isCalculating,
    error,
    notCalculatedYet,
    refetch: fetchGoal,
    calculateGoal,
  };
}