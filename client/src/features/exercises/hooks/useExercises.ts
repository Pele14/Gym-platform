import { useCallback, useEffect, useState } from "react";
import { exerciseService } from "../services/exerciseService";
import type { CreateExercisePayload, Exercise } from "../types/exercise_types";

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await exerciseService.getExercises();
      setExercises(data.exercises);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load exercises.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const createExercise = async (
    payload: CreateExercisePayload,
    isSystem: boolean
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = isSystem
        ? await exerciseService.createSystemExercise(payload)
        : await exerciseService.createCustomExercise(payload);

      setExercises((prev) => [...prev, data.exercise]);
      return data.exercise;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create exercise.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExercise = async (exerciseId: number, isSystem: boolean) => {
    try {
      setError(null);

      if (isSystem) {
        await exerciseService.deleteSystemExercise(exerciseId);
      } else {
        await exerciseService.deleteCustomExercise(exerciseId);
      }

      setExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete exercise.";
      setError(message);
      throw err;
    }
  };

  return {
    exercises,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchExercises,
    createExercise,
    deleteExercise,
  };
}