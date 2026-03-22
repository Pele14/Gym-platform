import { http } from "../../../services/http";
import type {
  FinishWorkoutResponse,
  GetExerciseStatsResponse,
  GetWorkoutHistoryResponse,
  GetWorkoutSessionResponse,
  StartWorkoutResponse,
  UpdateWorkoutSessionSetPayload,
  UpdateWorkoutSessionSetResponse,
} from "../types/workout_session_types";

export const workoutSessionService = {
  async startWorkout(planId: number): Promise<StartWorkoutResponse> {
    return http<StartWorkoutResponse>(`/api/workout-sessions/start/${planId}`, {
      method: "POST",
    });
  },

  async getWorkoutSession(sessionId: number): Promise<GetWorkoutSessionResponse> {
    return http<GetWorkoutSessionResponse>(`/api/workout-sessions/${sessionId}`, {
      method: "GET",
    });
  },

  async getWorkoutHistory(): Promise<GetWorkoutHistoryResponse> {
    return http<GetWorkoutHistoryResponse>("/api/workout-sessions/history", {
      method: "GET",
    });
  },

  async updateWorkoutSessionSet(
    sessionId: number,
    setId: number,
    payload: UpdateWorkoutSessionSetPayload
  ): Promise<UpdateWorkoutSessionSetResponse> {
    return http<UpdateWorkoutSessionSetResponse>(
      `/api/workout-sessions/${sessionId}/sets/${setId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  async finishWorkout(sessionId: number): Promise<FinishWorkoutResponse> {
    return http<FinishWorkoutResponse>(
      `/api/workout-sessions/${sessionId}/finish`,
      {
        method: "POST",
      }
    );
  },

  async getExerciseStats(exerciseId: number): Promise<GetExerciseStatsResponse> {
    return http<GetExerciseStatsResponse>(
      `/api/workout-sessions/exercise-stats/${exerciseId}`,
      {
        method: "GET",
      }
    );
  },
};