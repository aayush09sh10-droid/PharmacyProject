import { API_URL, handleResponse } from "./auth.service.js";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function fetchNotifications() {
  const response = await fetch(`${API_URL}/api/v1/notifications`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function markNotificationAsRead(id) {
  const response = await fetch(`${API_URL}/api/v1/notifications/${id}/read`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function markAllNotificationsAsRead() {
  const response = await fetch(`${API_URL}/api/v1/notifications/read-all`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead };
