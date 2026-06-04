import { isAxiosError } from "axios";

export type AdminValidationErrors = Record<string, string[] | undefined>;

export function getValidationErrors(error: unknown): AdminValidationErrors {
  if (!isAxiosError(error)) {
    return {};
  }

  const data = error.response?.data;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  return data as AdminValidationErrors;
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;

  if (data && typeof data === "object" && "message" in data) {
    const message = data.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

export function getHttpStatus(error: unknown) {
  if (!isAxiosError(error)) {
    return undefined;
  }

  return error.response?.status;
}
