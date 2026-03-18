import { getToken } from "./tokenStorage";

const API_BASE_URL = "http://localhost:5000";

interface ApiErrorResponse {
  message?: string;
}

interface HttpOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function http<T>(
  path: string,
  options: HttpOptions = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as ApiErrorResponse).message === "string"
        ? (data as ApiErrorResponse).message as string
        : "Something went wrong";

    throw new Error(errorMessage);
  }

  return data as T;
}