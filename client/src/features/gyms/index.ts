export { gymService } from "./services/gymService";
export { useNearbyGyms } from "./hooks/useNearbyGyms";
export { default as NearbyGymsView } from "./components/nearbyGymsView";

export type {
  Gym,
  NearbyGymsCoordinates,
  GetNearbyGymsResponse,
} from "./types/gym_types";