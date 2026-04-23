import React, { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";
import { getStoredUser } from "../../services/auth.service.js";
import {
  clearCart,
  getCartCount,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from "../../services/cart.service.js";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getCartItems());
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  useEffect(() => {
    const syncCart = () => {
      setItems(getCartItems());
      setCartCount(getCartCount());
    };

    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  useEffect(() => {
    const syncUser = () => setCurrentUser(getStoredUser());
    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items],
  );
  const isCustomerLoggedIn = Boolean(currentUser && currentUser.role === "User");

  return (
    <div className="min-h-screen bg-[#f5fcfb] text-slate-900">
      <PharmaHeader activePage="cart" cartCount={cartCount} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton label="Continue Shopping" onClick={() => navigate("/")} />

        <section className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-100">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-slate-900">Shopping Cart</h1>
              <p className="mt-2 text-base text-slate-500">{cartCount} items in your cart</p>
            </div>
          </div>
        </section>

        {items.length === 0 ? (
          <section className="mt-8">
            <article className="rounded-[24px] bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.1)] sm:p-10">
              <div className="flex min-h-80 flex-col items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <ShoppingCart size={24} />
                </div>
                <h2 className="mt-5 text-3xl font-semibold text-slate-900">
                  Your cart is empty
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Add medicines from approved vendor pharmacies and they will appear here.
                </p>
              </div>
            </article>
          </section>
        ) : (
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
            <article className="rounded-[24px] bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.1)]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.vendorId}`}
                    className="flex flex-col gap-4 rounded-[22px] border border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{item.vendorName}</p>
                      <p className="mt-2 text-sm font-medium text-emerald-600">{formatCurrency(item.price)} each</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.vendorId, Math.max(item.quantity - 1, 0))
                          }
                          className="rounded-full p-2 text-slate-600 transition hover:bg-white"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.vendorId, item.quantity + 1)
                          }
                          className="rounded-full p-2 text-slate-600 transition hover:bg-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="min-w-24 text-right text-lg font-bold text-slate-950">
                        {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.vendorId)}
                        className="rounded-full p-3 text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-[24px] bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.1)]">
              <h2 className="text-2xl font-semibold text-slate-900">Order Summary</h2>

              <div className="mt-6 space-y-4 text-sm text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Total items</span>
                  <span className="font-semibold text-slate-900">{cartCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(0)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700">Total</span>
                  <span className="text-2xl font-bold text-emerald-800">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(isCustomerLoggedIn ? "/" : "/signin")}
                className="mt-6 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:opacity-95"
              >
                {isCustomerLoggedIn ? "Proceed to Checkout" : "Continue to Login"}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Cart
              </button>
            </aside>
          </section>
        )}
      </main>

      <PharmaFooter />
    </div>
  );
}
