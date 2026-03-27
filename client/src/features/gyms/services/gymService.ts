import { http } from "../../../services/http";
import type {
  GetNearbyGymsResponse,
  NearbyGymsCoordinates,
} from "../types/gym_types";

export const gymService = {
  async getNearbyGyms(
    coordinates: NearbyGymsCoordinates
  ): Promise<GetNearbyGymsResponse> {
    const params = new URLSearchParams({
      lat: String(coordinates.lat),
      lng: String(coordinates.lng),
    });

    return http<GetNearbyGymsResponse>(`/api/gyms/nearby?${params.toString()}`, {
      method: "GET",
    });
  },
};