import { http } from "../../../services/http";
import type {
  CreateExercisePayload,
  ExerciseResponse,
  GetExercisesResponse,
  UpdateExercisePayload,
} from "../types/exercise_types";

export const exerciseService = {
  async getExercises(): Promise<GetExercisesResponse> {
    return http<GetExercisesResponse>("/api/exercises", {
      method: "GET",
    });
  },

  async createSystemExercise(payload: CreateExercisePayload): Promise<ExerciseResponse> {
    return http<ExerciseResponse>("/api/exercises/system", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async createCustomExercise(payload: CreateExercisePayload): Promise<ExerciseResponse> {
    return http<ExerciseResponse>("/api/exercises/custom", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateSystemExercise(
    exerciseId: number,
    payload: UpdateExercisePayload
  ): Promise<ExerciseResponse> {
    return http<ExerciseResponse>(`/api/exercises/system/${exerciseId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async updateCustomExercise(
    exerciseId: number,
    payload: UpdateExercisePayload
  ): Promise<ExerciseResponse> {
    return http<ExerciseResponse>(`/api/exercises/custom/${exerciseId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteSystemExercise(exerciseId: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/exercises/system/${exerciseId}`, {
      method: "DELETE",
    });
  },

  async deleteCustomExercise(exerciseId: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/exercises/custom/${exerciseId}`, {
      method: "DELETE",
    });
  },
};