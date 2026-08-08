import axios from "axios";

export function handleApiError(
  error: unknown,
  fallbackMessage: string
): never {
  if (axios.isAxiosError(error)) {
    throw new Error(
      error.response?.data?.message ??
        error.message ??
        fallbackMessage
    );
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(fallbackMessage);
}