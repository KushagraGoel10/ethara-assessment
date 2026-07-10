type ApiErrorResponse = {
  detail?: string
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse

    if (data.detail) {
      return data.detail
    }
  }

  return fallbackMessage
}
