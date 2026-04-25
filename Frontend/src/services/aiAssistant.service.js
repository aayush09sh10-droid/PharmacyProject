import { API_URL, handleResponse } from "./auth.service.js";

async function askAiAssistant(prompt) {
  const response = await fetch(`${API_URL}/api/v1/users/ai-assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  return handleResponse(response);
}

export { askAiAssistant };
