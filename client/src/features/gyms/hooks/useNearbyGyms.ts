import { useCallback, useEffect, useState } from "react";
import { gymService } from "../services/gymService";
import type { Gym, NearbyGymsCoordinates } from "../types/gym_types";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};

function mapNearbyGymsApiError(message: string) {
  const normalized = message.trim().toLowerCase();

  if (normalized.includes("provider") || normalized.includes("temporarily unavailable")) {
    return "Gym search is temporarily unavailable. Please try again in a moment.";
  }

  if (normalized.includes("network") || normalized.includes("failed to fetch")) {
    return "Network issue while loading gyms. Check your connection and retry.";
  }

  return message;
}

function mapGeolocationError(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location access was blocked. Enable location permission or search with coordinates.";
  }

  if (error.code === error.TIMEOUT) {
    return "Location request timed out. Try again or enter coordinates manually.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Your location is unavailable right now. Try again or enter coordinates manually.";
  }

  return error.message || "Unable to access your location.";
}

function roundCoordinate(value: number) {
  return Number(value.toFixed(6));
}

function resolveBrowserLocation(): Promise<NearbyGymsCoordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported on this device."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: roundCoordinate(position.coords.latitude),
          lng: roundCoordinate(position.coords.longitude),
        });
      },
      (error) => {
        reject(new Error(mapGeolocationError(error)));
      },
      GEOLOCATION_OPTIONS
    );
  });
}

export function useNearbyGyms() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [coordinates, setCoordinates] = useState<NearbyGymsCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyGyms = useCallback(async (nextCoordinates: NearbyGymsCoordinates) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await gymService.getNearbyGyms(nextCoordinates);

      setCoordinates(nextCoordinates);
      setGyms(response.gyms);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load nearby gyms.";
      setError(mapNearbyGymsApiError(message));
      setCoordinates(nextCoordinates);
      setGyms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestCurrentLocation = useCallback(async () => {
    try {
      setIsLocating(true);
      setError(null);

      const nextCoordinates = await resolveBrowserLocation();
      await fetchNearbyGyms(nextCoordinates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get your current location.");
    } finally {
      setIsLocating(false);
    }
  }, [fetchNearbyGyms]);

  useEffect(() => {
    void requestCurrentLocation();
  }, [requestCurrentLocation]);

  return {
    gyms,
    coordinates,
    isLoading,
    isLocating,
    error,
    fetchNearbyGyms,
    requestCurrentLocation,
  };
}