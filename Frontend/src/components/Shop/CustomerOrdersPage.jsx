import React, { useEffect, useState } from "react";
import { Package, ShoppingBag, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";
import { clearAuthSession, getStoredUser } from "../../services/auth.service.js";
import { getCartCount } from "../../services/cart.service.js";
import { cancelCustomerOrder, fetchCustomerOrders } from "../../services/order.service.js";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`;
}

function getStatusTone(status) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700";
    case "Processing":
      return "bg-blue-50 text-blue-700";
    case "Shipped":
      return "bg-violet-50 text-violet-700";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700";
    case "Cancelled":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function canCancelOrder(status) {
  return ["Pending", "Processing"].includes(status);
}

export default function CustomerOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [cancellingOrderId, setCancellingOrderId] = useState("");

  const loadOrders = async () => {
    try {
      setError("");
      const data = await fetchCustomerOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 401) {
        clearAuthSession();
        navigate("/customer-login", { replace: true });
        return;
      }

      setError(err.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "User") {
      navigate("/signin", { replace: true });
      return;
    }

    loadOrders();
  }, [navigate]);

  useEffect(() => {
    const handleCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Do you want to cancel this order?")) {
      return;
    }

    setError("");
    setCancellingOrderId(orderId);

    try {
      const updatedOrder = await cancelCustomerOrder(orderId, "Cancelled by customer");
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? updatedOrder : order)),
      );
    } catch (err) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5fcfb] text-slate-900">
      <PharmaHeader activePage="orders" cartCount={cartCount} showCustomerMenu />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton label="Back to Home" onClick={() => navigate("/")} />

        <section className="mt-6 flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-100">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">My Orders</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Track your pharmacy purchases and cancel orders before they are shipped.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="mt-8 rounded-[24px] bg-white p-8 text-lg text-slate-500 shadow-[0_18px_55px_rgba(15,23,42,0.1)]">
            Loading your orders...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[24px] border border-red-200 bg-red-50 p-8 text-lg text-red-700 shadow-[0_18px_55px_rgba(15,23,42,0.1)]">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-[24px] bg-white p-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.1)]">
            <Package size={30} className="mx-auto text-emerald-500" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">No orders yet</h2>
            <p className="mt-2 text-slate-500">Your placed pharmacy orders will appear here.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-[24px] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.1)]"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="break-all text-lg font-semibold text-slate-900 sm:text-xl">{order.orderId}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString()} • {order.items?.length || 0} items
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Payment Method: <span className="font-semibold text-slate-900">{order.paymentMethod || "Cash on Delivery"}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Payment Status: <span className="font-semibold text-slate-900">{order.paymentStatus || "Unpaid"}</span>
                    </p>
                    {order.cancellation?.reason ? (
                      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <p className="font-semibold">
                          {order.cancellation.byRole ? `${order.cancellation.byRole} cancelled this order.` : "This order was cancelled."}
                        </p>
                        <p className="mt-1">{order.cancellation.reason}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 xl:min-w-[240px]">
                    <div className="flex items-center gap-3">
                      <Truck className="text-emerald-500" size={20} />
                      <div>
                        <p className="text-sm text-slate-500">Total</p>
                        <p className="text-2xl font-bold text-slate-950">{formatCurrency(order.totalAmount)}</p>
                      </div>
                    </div>
                    {canCancelOrder(order.status) ? (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                        className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {cancellingOrderId === order._id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {order.status === "Cancelled"
                          ? "This order has already been cancelled."
                          : "This order can no longer be cancelled."}
                      </p>
                    )}
                    {order.cancellation?.cancelledAt ? (
                      <p className="text-xs text-slate-400">
                        Cancelled on {new Date(order.cancellation.cancelledAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                </div>

                {order.items?.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${item.productId || index}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Item {index + 1}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          Quantity: <span className="font-semibold text-slate-900">{item.quantity}</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Price: <span className="font-semibold text-slate-900">{formatCurrency(item.price)}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>

      <PharmaFooter />
    </div>
  );
}
