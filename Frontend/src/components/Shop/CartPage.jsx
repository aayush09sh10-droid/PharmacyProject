import React from "react";
import { Lock, Package2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";

export default function CartPage() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isCustomerLoggedIn = Boolean(user && user.role === "User");

  return (
    <div className="min-h-screen bg-[#f5fcfb] text-slate-900">
      <PharmaHeader activePage="cart" cartCount={0} showCustomerMenu={isCustomerLoggedIn} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton label="Continue Shopping" onClick={() => navigate("/")} />

        <section className="mt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-100">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-slate-900">Shopping Cart</h1>
              <p className="mt-2 text-base text-slate-500">0 items in your cart</p>
            </div>
          </div>
        </section>

        {isCustomerLoggedIn ? (
          <section className="mt-8">
            <article className="rounded-[24px] bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.1)] sm:p-10">
              <div className="flex min-h-80 flex-col items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <Package2 size={24} />
                </div>
                <h2 className="mt-5 text-3xl font-semibold text-slate-900">
                  Your cart is empty
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Cart items are currently set to <span className="font-semibold text-emerald-700">0</span>.
                  When backend and cart integration are connected, selected medicines
                  will appear here.
                </p>
              </div>
            </article>
          </section>
        ) : (
          <section className="mt-8">
            <article className="rounded-[24px] bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.1)] sm:p-10">
              <div className="flex min-h-80 flex-col items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <Lock size={24} />
                </div>
                <h2 className="mt-5 text-3xl font-semibold text-slate-900">
                  Login or sign up to view your cart
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  No user is logged in right now. Please log in first to open your
                  customer cart. Cart count is currently <span className="font-semibold text-emerald-700">0</span>.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/signin")}
                    className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:opacity-95"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </article>
          </section>
        )}
      </main>

      <PharmaFooter />
    </div>
  );
}
