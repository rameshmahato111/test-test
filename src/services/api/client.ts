export const API_BASE_URL = "https://api-v1.exploreden.com";

const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "Unauthorized. Please login again.",
  403: "Access forbidden. You don't have permission to access this resource.",
  404: "The requested resource was not found.",
  408: "Request timeout. Please try again.",
  429: "Too many requests. Please try again later.",
  500: "Internal server error. Please try again later.",
  502: "Bad gateway. Please try again later.",
  503: "Service unavailable. Please try again later.",
  504: "Gateway timeout. Please try again later.",
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage: string;

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.detail ||
        errorData.message ||
        (typeof errorData === "object"
          ? Object.values(errorData).flat().join(", ")
          : errorData);
    } catch (e) {
      // If JSON parsing fails, use predefined error messages
      errorMessage =
        ERROR_MESSAGES[response.status] ||
        `HTTP error! status: ${response.status}`;
    }
    throw errorMessage;
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error("Failed to parse response data. Please try again.");
  }
}
export { handleResponse };
