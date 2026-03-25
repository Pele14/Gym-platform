export interface ExerciseSummary {
  id: number;
  name: string;
  description: string | null;
  muscle_group: string;
  equipment: string | null;
  difficulty: string | null;
  is_system: boolean;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface RoutineExerciseSet {
  id: number;
  workout_plan_exercise_id: number;
  set_order: number;
  target_reps: number;
  target_weight_kg: number;
  created_at: string;
  updated_at: string;
}

export interface RoutineExercise {
  id: number;
  workout_plan_id: number;
  exercise_id: number;
  exercise_order: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  exercise: ExerciseSummary | null;
  sets?: RoutineExerciseSet[];
}

export interface Routine {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  exercises?: RoutineExercise[];
}

export interface GetRoutinesResponse {
  plans: Routine[];
}

export interface GetRoutineResponse {
  plan: Routine;
}

export interface CreateRoutinePayload {
  name: string;
  description?: string;
}

export interface UpdateRoutinePayload {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface AddExerciseToRoutinePayload {
  exercise_id: number;
  exercise_order: number;
  notes?: string;
}

export interface AddSetToRoutineExercisePayload {
  set_order: number;
  target_reps: number;
  target_weight_kg: number;
}

export interface RoutineExerciseResponse {
  exercise: RoutineExercise;
}

export interface RoutineSetResponse {
  set: RoutineExerciseSet;
}