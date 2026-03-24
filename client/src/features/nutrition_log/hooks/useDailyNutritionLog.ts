import { useCallback, useEffect, useState } from "react";
import { nutritionLogService } from "../services/nutritionLogService";
import type {
  DailyNutritionLog,
  NutritionGoal,
  RemainingMacros,
} from "../types/nutrition_log_types";

export function useDailyNutritionLog(date: string) {
  const [dailyLog, setDailyLog] = useState<DailyNutritionLog | null>(null);
  const [goal, setGoal] = useState<NutritionGoal | null>(null);
  const [remaining, setRemaining] = useState<RemainingMacros | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyLog = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await nutritionLogService.getDailyLog(date);
      setDailyLog(data.log);
      setGoal(data.goal);
      setRemaining(data.remaining);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily log.");
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void fetchDailyLog();
  }, [fetchDailyLog]);

  const createMeal = async (name: string, meal_order: number = 1) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await nutritionLogService.createMeal({
        date,
        name,
        meal_order,
      });

      setDailyLog((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          meals: [...prev.meals, data.meal],
          total_calories: prev.total_calories + data.meal.total_calories,
          total_protein: prev.total_protein + data.meal.total_protein,
          total_carbs: prev.total_carbs + data.meal.total_carbs,
          total_fat: prev.total_fat + data.meal.total_fat,
        };
      });

      if (remaining && goal) {
        setRemaining({
          calories: remaining.calories - data.meal.total_calories,
          protein: remaining.protein - data.meal.total_protein,
          carbs: remaining.carbs - data.meal.total_carbs,
          fat: remaining.fat - data.meal.total_fat,
        });
      }

      return data.meal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create meal.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMeal = async (
    mealId: number,
    name?: string,
    meal_order?: number
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await nutritionLogService.updateMeal(mealId, {
        name,
        meal_order,
      });

      setDailyLog((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          meals: prev.meals.map((meal) =>
            meal.id === mealId ? data.meal : meal
          ),
        };
      });

      return data.meal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update meal.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMeal = async (mealId: number) => {
    try {
      setError(null);

      const mealToDelete = dailyLog?.meals.find((m) => m.id === mealId);

      await nutritionLogService.deleteMeal(mealId);

      setDailyLog((prev) => {
        if (!prev || !mealToDelete) return prev;
        return {
          ...prev,
          meals: prev.meals.filter((meal) => meal.id !== mealId),
          total_calories: prev.total_calories - mealToDelete.total_calories,
          total_protein: prev.total_protein - mealToDelete.total_protein,
          total_carbs: prev.total_carbs - mealToDelete.total_carbs,
          total_fat: prev.total_fat - mealToDelete.total_fat,
        };
      });

      if (remaining && mealToDelete) {
        setRemaining({
          calories: remaining.calories + mealToDelete.total_calories,
          protein: remaining.protein + mealToDelete.total_protein,
          carbs: remaining.carbs + mealToDelete.total_carbs,
          fat: remaining.fat + mealToDelete.total_fat,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete meal.";
      setError(message);
      throw err;
    }
  };

  const createEntry = async (mealId: number, food_id: number, grams: number) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await nutritionLogService.createEntry(mealId, {
        food_id,
        grams,
      });

      setDailyLog((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          meals: prev.meals.map((meal) => {
            if (meal.id === mealId) {
              return {
                ...meal,
                entries: [...meal.entries, data.entry],
                total_calories: meal.total_calories + data.entry.consumed_calories,
                total_protein: meal.total_protein + data.entry.consumed_protein,
                total_carbs: meal.total_carbs + data.entry.consumed_carbs,
                total_fat: meal.total_fat + data.entry.consumed_fat,
              };
            }
            return meal;
          }),
          total_calories: prev.total_calories + data.entry.consumed_calories,
          total_protein: prev.total_protein + data.entry.consumed_protein,
          total_carbs: prev.total_carbs + data.entry.consumed_carbs,
          total_fat: prev.total_fat + data.entry.consumed_fat,
        };
      });

      if (remaining) {
        setRemaining({
          calories: remaining.calories - data.entry.consumed_calories,
          protein: remaining.protein - data.entry.consumed_protein,
          carbs: remaining.carbs - data.entry.consumed_carbs,
          fat: remaining.fat - data.entry.consumed_fat,
        });
      }

      return data.entry;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create entry.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEntry = async (
    mealId: number,
    entryId: number,
    food_id?: number,
    grams?: number
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await nutritionLogService.updateEntry(mealId, entryId, {
        food_id,
        grams,
      });

      let caloriesDiff = 0;
      let proteinDiff = 0;
      let carbsDiff = 0;
      let fatDiff = 0;

      setDailyLog((prev) => {
        if (!prev) return null;

        const oldEntry = prev.meals
          .find((m) => m.id === mealId)
          ?.entries.find((e) => e.id === entryId);

        if (!oldEntry) return prev;

        caloriesDiff = data.entry.consumed_calories - oldEntry.consumed_calories;
        proteinDiff = data.entry.consumed_protein - oldEntry.consumed_protein;
        carbsDiff = data.entry.consumed_carbs - oldEntry.consumed_carbs;
        fatDiff = data.entry.consumed_fat - oldEntry.consumed_fat;

        return {
          ...prev,
          meals: prev.meals.map((meal) => {
            if (meal.id === mealId) {
              return {
                ...meal,
                entries: meal.entries.map((e) =>
                  e.id === entryId ? data.entry : e
                ),
                total_calories: meal.total_calories + caloriesDiff,
                total_protein: meal.total_protein + proteinDiff,
                total_carbs: meal.total_carbs + carbsDiff,
                total_fat: meal.total_fat + fatDiff,
              };
            }
            return meal;
          }),
          total_calories: prev.total_calories + caloriesDiff,
          total_protein: prev.total_protein + proteinDiff,
          total_carbs: prev.total_carbs + carbsDiff,
          total_fat: prev.total_fat + fatDiff,
        };
      });

      if (remaining) {
        setRemaining({
          calories: remaining.calories - caloriesDiff,
          protein: remaining.protein - proteinDiff,
          carbs: remaining.carbs - carbsDiff,
          fat: remaining.fat - fatDiff,
        });
      }

      return data.entry;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update entry.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEntry = async (mealId: number, entryId: number) => {
    try {
      setError(null);

      const entryToDelete = dailyLog?.meals
        .find((m) => m.id === mealId)
        ?.entries.find((e) => e.id === entryId);

      await nutritionLogService.deleteEntry(mealId, entryId);

      setDailyLog((prev) => {
        if (!prev || !entryToDelete) return prev;
        return {
          ...prev,
          meals: prev.meals.map((meal) => {
            if (meal.id === mealId) {
              return {
                ...meal,
                entries: meal.entries.filter((e) => e.id !== entryId),
                total_calories: meal.total_calories - entryToDelete.consumed_calories,
                total_protein: meal.total_protein - entryToDelete.consumed_protein,
                total_carbs: meal.total_carbs - entryToDelete.consumed_carbs,
                total_fat: meal.total_fat - entryToDelete.consumed_fat,
              };
            }
            return meal;
          }),
          total_calories: prev.total_calories - entryToDelete.consumed_calories,
          total_protein: prev.total_protein - entryToDelete.consumed_protein,
          total_carbs: prev.total_carbs - entryToDelete.consumed_carbs,
          total_fat: prev.total_fat - entryToDelete.consumed_fat,
        };
      });

      if (remaining && entryToDelete) {
        setRemaining({
          calories: remaining.calories + entryToDelete.consumed_calories,
          protein: remaining.protein + entryToDelete.consumed_protein,
          carbs: remaining.carbs + entryToDelete.consumed_carbs,
          fat: remaining.fat + entryToDelete.consumed_fat,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete entry.";
      setError(message);
      throw err;
    }
  };

  return {
    dailyLog,
    goal,
    remaining,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchDailyLog,
    createMeal,
    updateMeal,
    deleteMeal,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
