export type UserProfile = {
  id: number;
  user_id: number;
  date_of_birth: string | null;
  age: number | null;
  profile_image_url: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile: UserProfile | null;
};

export type GetUsersResponse = {
  users: User[];
};