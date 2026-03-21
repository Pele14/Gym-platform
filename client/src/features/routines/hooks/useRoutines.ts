import { useCallback, useEffect, useState } from "react";
import { routineService } from "../services/routineService";
import type {
  AddExerciseToRoutinePayload,
  AddSetToRoutineExercisePayload,
  CreateRoutinePayload,
  Routine,
} from "../types/routine_types";

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await routineService.getRoutines();
      setRoutines(data.plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load routines.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const selectRoutine = async (planId: number) => {
    try {
      setError(null);
      const data = await routineService.getRoutineById(planId);
      setSelectedRoutine(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load routine.");
    }
  };

  const createRoutine = async (payload: CreateRoutinePayload) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await routineService.createRoutine(payload);
      setRoutines((prev) => [data.plan, ...prev]);
      return data.plan;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create routine.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRoutine = async (planId: number) => {
    try {
      setError(null);
      await routineService.deleteRoutine(planId);

      setRoutines((prev) => prev.filter((routine) => routine.id !== planId));

      if (selectedRoutine?.id === planId) {
        setSelectedRoutine(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete routine.");
      throw err;
    }
  };

  const addExerciseToRoutine = async (
    planId: number,
    payload: AddExerciseToRoutinePayload
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await routineService.addExerciseToRoutine(planId, payload);
      const refreshed = await routineService.getRoutineById(planId);
      setSelectedRoutine(refreshed.plan);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add exercise to routine."
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRoutineExercise = async (planId: number, planExerciseId: number) => {
    try {
      setError(null);
      await routineService.deleteRoutineExercise(planId, planExerciseId);

      if (selectedRoutine?.id === planId) {
        const refreshed = await routineService.getRoutineById(planId);
        setSelectedRoutine(refreshed.plan);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete routine exercise."
      );
      throw err;
    }
  };

  const addSetToRoutineExercise = async (
    planId: number,
    planExerciseId: number,
    payload: AddSetToRoutineExercisePayload
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await routineService.addSetToRoutineExercise(planId, planExerciseId, payload);

      if (selectedRoutine?.id === planId) {
        const refreshed = await routineService.getRoutineById(planId);
        setSelectedRoutine(refreshed.plan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add set.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRoutineExerciseSet = async (
    planId: number,
    planExerciseId: number,
    setId: number
  ) => {
    try {
      setError(null);

      await routineService.deleteRoutineExerciseSet(planId, planExerciseId, setId);

      if (selectedRoutine?.id === planId) {
        const refreshed = await routineService.getRoutineById(planId);
        setSelectedRoutine(refreshed.plan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete set.");
      throw err;
    }
  };

  return {
    routines,
    selectedRoutine,
    isLoading,
    isSubmitting,
    error,
    setSelectedRoutine,
    fetchRoutines,
    selectRoutine,
    createRoutine,
    deleteRoutine,
    addExerciseToRoutine,
    deleteRoutineExercise,
    addSetToRoutineExercise,
    deleteRoutineExerciseSet,
  };
}