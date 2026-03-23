import { useCallback, useEffect, useState } from "react";
import { currentUserService } from "../services/current_user_service";
import type {
  CurrentUser,
  UpdateCurrentUserPayload,
} from "../types/currentUser";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await currentUserService.getMe();
      setCurrentUser(data.user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load current user."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCurrentUser();
  }, [fetchCurrentUser]);

  const updateCurrentUser = async (payload: UpdateCurrentUserPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = await currentUserService.updateMe(payload);
      setCurrentUser(data.user);

      return data.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update user.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchCurrentUser,
    updateCurrentUser,
  };
}