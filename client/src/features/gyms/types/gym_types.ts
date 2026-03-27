export interface Gym {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  open_now: boolean | null;
  weekday_text: string[];
}

export interface NearbyGymsCoordinates {
  lat: number;
  lng: number;
}

export interface GetNearbyGymsResponse {
  gyms: Gym[];
}