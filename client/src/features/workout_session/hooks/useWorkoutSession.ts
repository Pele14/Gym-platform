import { useCallback, useState } from "react";
import { workoutSessionService } from "../services/workoutSessionService";
import type {
  ExerciseStats,
  UpdateWorkoutSessionSetPayload,
  WorkoutSession,
} from "../types/workout_session_types";

export function useWorkoutSession() {
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startWorkout = useCallback(async (planId: number) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await workoutSessionService.startWorkout(planId);
      setActiveSession(data.session);

      return data.session;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start workout.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const loadWorkoutSession = useCallback(async (sessionId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await workoutSessionService.getWorkoutSession(sessionId);
      setActiveSession(data.session);

      return data.session;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load workout session.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWorkoutSet = useCallback(
    async (
      sessionId: number,
      setId: number,
      payload: UpdateWorkoutSessionSetPayload
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        await workoutSessionService.updateWorkoutSessionSet(sessionId, setId, payload);

        const refreshed = await workoutSessionService.getWorkoutSession(sessionId);
        setActiveSession(refreshed.session);

        return refreshed.session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update workout set.";
        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const finishWorkout = useCallback(async (sessionId: number) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await workoutSessionService.finishWorkout(sessionId);
      setActiveSession(data.session);

      return data.session;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to finish workout.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const loadWorkoutHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await workoutSessionService.getWorkoutHistory();
      setHistory(data.sessions);

      return data.sessions;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load workout history.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadExerciseStats = useCallback(async (exerciseId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await workoutSessionService.getExerciseStats(exerciseId);
      setExerciseStats(data.stats);

      return data.stats;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load exercise stats.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearActiveSession = useCallback(() => {
    setActiveSession(null);
  }, []);

  return {
    activeSession,
    history,
    exerciseStats,
    isLoading,
    isSubmitting,
    error,
    startWorkout,
    loadWorkoutSession,
    updateWorkoutSet,
    finishWorkout,
    loadWorkoutHistory,
    loadExerciseStats,
    clearActiveSession,
  };
}