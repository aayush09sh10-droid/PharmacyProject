const CART_STORAGE_KEY = "pharmaCart";

function readCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

function getCartItems() {
  return readCart();
}

function getCartCount() {
  return readCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function addToCart(product) {
  const currentItems = readCart();
  const existingItem = currentItems.find(
    (item) => item.productId === product.productId && item.vendorId === product.vendorId,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    currentItems.push({
      ...product,
      quantity: 1,
    });
  }

  writeCart(currentItems);
}

function updateCartQuantity(productId, vendorId, quantity) {
  const currentItems = readCart();
  const nextItems = currentItems
    .map((item) =>
      item.productId === productId && item.vendorId === vendorId
        ? { ...item, quantity }
        : item,
    )
    .filter((item) => item.quantity > 0);

  writeCart(nextItems);
}

function removeFromCart(productId, vendorId) {
  const currentItems = readCart();
  const nextItems = currentItems.filter(
    (item) => !(item.productId === productId && item.vendorId === vendorId),
  );

  writeCart(nextItems);
}

function clearCart() {
  writeCart([]);
}

export {
  addToCart,
  clearCart,
  getCartCount,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
};
