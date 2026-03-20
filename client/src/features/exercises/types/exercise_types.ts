export interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  description: string | null;
  equipment: string | null;
  difficulty: string | null;
  is_system: boolean;
  created_by_user_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface GetExercisesResponse {
  exercises: Exercise[];
}

export interface ExerciseResponse {
  exercise: Exercise;
  message?: string;
}

export interface CreateExercisePayload {
  name: string;
  muscle_group: string;
  description?: string;
  equipment?: string;
  difficulty?: string;
}

export interface UpdateExercisePayload {
  name?: string;
  muscle_group?: string;
  description?: string;
  equipment?: string;
  difficulty?: string;
}