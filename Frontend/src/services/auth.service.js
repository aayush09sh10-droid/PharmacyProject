const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const AUTH_STORAGE_KEYS = ["user", "accessToken"];

async function handleResponse(response) {
  const text = await response.text();
  let body = {};

  if (text) {
    try {
      body = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Server returned ${response.status}: ${text}`);
    }
  }

  if (!response.ok) {
    throw new Error(body.message || body.error || `Request failed with status ${response.status}`);
  }

  return body.data;
}

async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

async function registerUser(payload) {
  const response = await fetch(`${API_URL}/api/v1/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

async function logoutUser() {
  const token = localStorage.getItem("accessToken");
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/v1/users/logout`, {
    method: "POST",
    headers,
  });

  return handleResponse(response);
}

function saveAuthSession(data) {
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("accessToken", data.accessToken);
}

function clearAuthSession() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

export { clearAuthSession, loginUser, logoutUser, registerUser, saveAuthSession };
