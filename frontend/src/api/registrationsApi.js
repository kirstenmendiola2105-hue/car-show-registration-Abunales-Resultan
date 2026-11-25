
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5205";

async function handleResponse(response) {
  if (!response.ok) {
    let message = `API Error: ${response.status}`;

    try {
      const errorData = await response.json();

      message =
        errorData.detail ||
        errorData.title ||
        errorData.message ||
        message;

      if (errorData.errors) {
        const validationMessages = Object.values(errorData.errors)
          .flat()
          .join(", ");

        if (validationMessages) {
          message = validationMessages;
        }
      }
    } catch {
      // Keep the default error message if the response is not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getRegistrations({
  participantName = "",
  type = "",
  status = "",
  page = 1,
  pageSize = 10,
} = {}) {
  const params = new URLSearchParams();

  if (participantName.trim()) {
    params.append("participantName", participantName.trim());
  }

  if (type && type !== "All") {
    params.append("type", type);
  }

  if (status && status !== "All") {
    params.append("status", status);
  }

  params.append("page", page);
  params.append("pageSize", pageSize);

  const response = await fetch(
    `${API_BASE_URL}/api/registrations?${params.toString()}`
  );

  return handleResponse(response);
}

export async function getSummary() {
  const response = await fetch(
    `${API_BASE_URL}/api/registrations/summary`
  );

  return handleResponse(response);
}
