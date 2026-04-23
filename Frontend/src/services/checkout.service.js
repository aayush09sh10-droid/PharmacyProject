import { handleResponse } from "./auth.service.js";

const VENDOR_API_URL = import.meta.env.VITE_VENDOR_API_URL || "http://localhost:8001";

async function createCashOnDeliveryOrder(payload) {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      paymentMethod: "Cash on Delivery",
    }),
  });

  return handleResponse(response);
}

export { createCashOnDeliveryOrder };
