import { http } from "../../../services/http";
import type {
  AddExerciseToRoutinePayload,
  AddSetToRoutineExercisePayload,
  CreateRoutinePayload,
  GetRoutineResponse,
  GetRoutinesResponse,
  RoutineExerciseResponse,
  RoutineSetResponse,
  UpdateRoutinePayload,
} from "../types/routine_types";

export const routineService = {
  async getRoutines(): Promise<GetRoutinesResponse> {
    return http<GetRoutinesResponse>("/api/workouts", {
      method: "GET",
    });
  },

  async getRoutineById(planId: number): Promise<GetRoutineResponse> {
    return http<GetRoutineResponse>(`/api/workouts/${planId}`, {
      method: "GET",
    });
  },

  async createRoutine(payload: CreateRoutinePayload): Promise<GetRoutineResponse> {
    return http<GetRoutineResponse>("/api/workouts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateRoutine(
    planId: number,
    payload: UpdateRoutinePayload
  ): Promise<GetRoutineResponse> {
    return http<GetRoutineResponse>(`/api/workouts/${planId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteRoutine(planId: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/workouts/${planId}`, {
      method: "DELETE",
    });
  },

  async addExerciseToRoutine(
    planId: number,
    payload: AddExerciseToRoutinePayload
  ): Promise<RoutineExerciseResponse> {
    return http<RoutineExerciseResponse>(`/api/workouts/${planId}/exercises`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async deleteRoutineExercise(
    planId: number,
    planExerciseId: number
  ): Promise<{ message: string }> {
    return http<{ message: string }>(
      `/api/workouts/${planId}/exercises/${planExerciseId}`,
      {
        method: "DELETE",
      }
    );
  },

  async addSetToRoutineExercise(
    planId: number,
    planExerciseId: number,
    payload: AddSetToRoutineExercisePayload
  ): Promise<RoutineSetResponse> {
    return http<RoutineSetResponse>(
      `/api/workouts/${planId}/exercises/${planExerciseId}/sets`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  async deleteRoutineExerciseSet(
    planId: number,
    planExerciseId: number,
    setId: number
  ): Promise<{ message: string }> {
    return http<{ message: string }>(
      `/api/workouts/${planId}/exercises/${planExerciseId}/sets/${setId}`,
      {
        method: "DELETE",
      }
    );
  },
};