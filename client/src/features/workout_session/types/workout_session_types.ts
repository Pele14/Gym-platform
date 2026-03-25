export interface SessionExerciseSummary {
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

export interface PreviousSetSummary {
  reps: number | null;
  weight_kg: number | null;
}

export interface WorkoutSessionSet {
  id: number;
  workout_exercise_session_id: number;
  set_order: number;
  planned_reps: number;
  planned_weight_kg: number;
  actual_reps: number | null;
  actual_weight_kg: number | null;
  volume: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  previous?: PreviousSetSummary | null;
}

export interface WorkoutSessionExercise {
  id: number;
  workout_session_id: number;
  exercise_id: number;
  exercise_order: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  exercise: SessionExerciseSummary | null;
  sets?: WorkoutSessionSet[];
}

export interface WorkoutSession {
  id: number;
  user_id: number;
  workout_plan_id: number | null;
  name: string;
  notes: string | null;
  started_at: string | null;
  finished_at: string | null;
  duration_seconds: number | null;
  total_reps: number;
  total_volume: number;
  created_at: string;
  updated_at: string;
  exercises?: WorkoutSessionExercise[];
}

export interface StartWorkoutResponse {
  message: string;
  session: WorkoutSession;
}

export interface GetWorkoutSessionResponse {
  session: WorkoutSession;
}

export interface GetWorkoutHistoryResponse {
  sessions: WorkoutSession[];
}

export interface UpdateWorkoutSessionSetPayload {
  actual_reps?: number;
  actual_weight_kg?: number;
  is_completed?: boolean;
}

export interface UpdateWorkoutSessionSetResponse {
  message: string;
  set: WorkoutSessionSet;
}

export interface FinishWorkoutResponse {
  message: string;
  session: WorkoutSession;
}

export interface DiscardWorkoutResponse {
  message: string;
}

export interface ExerciseStats {
  exercise_id: number;
  max_weight: number | null;
  best_set_volume: number | null;
  total_volume: number;
}

export interface GetExerciseStatsResponse {
  stats: ExerciseStats;
}