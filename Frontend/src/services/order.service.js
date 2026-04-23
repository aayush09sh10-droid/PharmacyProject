import { API_URL, handleResponse } from "./auth.service.js";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function fetchCustomerOrders() {
  const response = await fetch(`${API_URL}/api/v1/users/orders`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export { fetchCustomerOrders };
