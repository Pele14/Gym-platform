export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type GoalType = "lose" | "maintain" | "gain";

export type CurrentUserProfile = {
  id: number;
  user_id: number;
  date_of_birth: string | null;
  age: number | null;
  profile_image_url: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  sex: Sex | null;
  activity_level: ActivityLevel | null;
  goal_type: GoalType | null;
  created_at: string;
  updated_at: string;
};

export type CurrentUser = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: CurrentUserProfile | null;
};

export type GetCurrentUserResponse = {
  user: CurrentUser;
};

export type UpdateCurrentUserPayload = {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string | null;
  profile_image_url?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  sex?: Sex | null;
  activity_level?: ActivityLevel | null;
  goal_type?: GoalType | null;
};

export type UpdateCurrentUserResponse = {
  message: string;
  user: CurrentUser;
};