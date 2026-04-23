import { handleResponse } from "./auth.service.js";

const VENDOR_API_URL = import.meta.env.VITE_VENDOR_API_URL || "http://localhost:8001";

async function fetchPublicCatalog() {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/products/catalog`);
  return handleResponse(response);
}

export { fetchPublicCatalog };
