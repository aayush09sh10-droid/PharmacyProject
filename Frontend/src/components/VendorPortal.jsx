import { createElement, useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Boxes,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  DollarSign,
  Edit2,
  Eye,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  createVendorProduct,
  deleteVendorProduct,
  fetchVendorDashboardStats,
  fetchVendorNotifications,
  fetchVendorOrders,
  fetchVendorProducts,
  getStoredVendor,
  logoutVendor,
  markAllVendorNotificationsAsRead,
  markVendorNotificationAsRead,
  updateVendorOrderStatus,
  updateVendorProduct,
} from "../services/vendor.service.js";
import NotificationBell from "./Notifications/NotificationBell.jsx";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { name: "Products", icon: Package, path: "products" },
  { name: "Inventory", icon: Boxes, path: "inventory" },
  { name: "Orders", icon: ClipboardList, path: "orders" },
];

const vendorShell = {
  page: "bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.14),_transparent_24%),linear-gradient(180deg,_#f5fbf7_0%,_#eef6f1_100%)]",
  card: "border border-emerald-100/80 bg-white/88 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm",
  mutedCard: "border border-emerald-100/70 bg-emerald-50/70",
  sidebar: "border-r border-emerald-200/80 bg-[linear-gradient(180deg,_#0f3d2e_0%,_#14532d_55%,_#1f6b4f_100%)] text-emerald-50 shadow-[0_24px_60px_rgba(6,78,59,0.28)]",
  sidebarSoft: "border-white/10 bg-white/8 text-emerald-50/80",
  sidebarActive: "bg-white text-emerald-900 shadow-[0_16px_40px_rgba(255,255,255,0.18)]",
  sidebarIdle: "text-emerald-50/78 hover:bg-white/8 hover:text-white",
};

function PendingApprovalPanel({ vendor }) {
  const isRejected = vendor.status === "rejected";

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className={`rounded-3xl p-4 sm:p-6 ${vendorShell.card}`}>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold sm:text-xs ${
            isRejected
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {isRejected ? <X size={12} /> : <Clock size={12} />}
          <span>{isRejected ? "Vendor Rejected" : "Pending Approval"}</span>
        </div>

        <h1 className="mt-4 text-xl font-black tracking-tight text-emerald-950 sm:text-2xl">
          {isRejected
            ? "Your vendor account has not been approved"
            : "Your vendor account is waiting for admin approval"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isRejected
            ? "Inventory and order tools stay locked until the registration issue is resolved."
            : "You can sign in and view your profile, but management tools will unlock only after admin approval."}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { label: "Pharmacy", value: vendor.pharmacyName || "Vendor Pharmacy" },
            { label: "Owner", value: vendor.ownerName || vendor.name },
            { label: "Status", value: vendor.status || "pending" },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl p-4 ${vendorShell.mutedCard}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60">
                {item.label}
              </p>
              <p className="mt-2 break-words text-sm font-bold capitalize text-emerald-950 sm:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, value, label, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-500",
    emerald: "bg-emerald-50 text-emerald-500",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return (
    <div className={`flex min-h-28 flex-col justify-between rounded-[1.6rem] p-4 transition-all hover:-translate-y-0.5 sm:min-h-36 sm:p-5 ${vendorShell.card}`}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-inner sm:h-10 sm:w-10 ${colors[color]}`}>
        {createElement(icon, { size: 16, className: "sm:h-[18px] sm:w-[18px]" })}
      </div>
      <div>
        <h2 className="break-words text-lg font-black tracking-tight text-emerald-950 sm:text-2xl">
          {value}
        </h2>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-emerald-800/55 sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
};

function VendorDashboardPage({ stats, loading }) {
  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-gray-400">
        <Loader2 className="mb-3 h-7 w-7 animate-spin text-emerald-500" />
        <p className="text-sm font-medium">Refreshing analytics...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-12">
      <div>
        <h1 className="text-xl font-bold text-emerald-950 sm:text-2xl">Dashboard Overview</h1>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">Real-time pharmacy analytics and alerts</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Clock} value={stats.totalOrders ?? 0} label="Total Orders" color="blue" />
        <StatCard
          icon={DollarSign}
          value={`Rs ${Number(stats.totalRevenue ?? 0).toFixed(2)}`}
          label="Total Revenue"
          color="emerald"
        />
        <StatCard icon={AlertTriangle} value={stats.lowStockCount ?? 0} label="Low Stock Alerts" color="orange" />
        <StatCard icon={Package} value={stats.pendingOrders ?? 0} label="Pending Orders" color="purple" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className={`rounded-[1.75rem] p-4 sm:p-5 lg:col-span-2 ${vendorShell.card}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-emerald-950 sm:text-lg">Recent Transactions</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <span>Latest orders</span>
              <Package size={12} />
            </div>
          </div>

          <div className="space-y-3">
            {(stats.recentOrders || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 italic">
                <Package size={22} className="mb-2 opacity-20" />
                <p className="text-sm">No recent orders found</p>
              </div>
            ) : (
              stats.recentOrders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/45 p-4 transition hover:border-emerald-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                      <Package size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-emerald-950">{order.orderId}</h4>
                      <p className="break-words text-xs text-slate-600">
                        {order.customerName} • {order.items?.length || 0} items
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800/50">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="sm:text-right">
                      <p className="text-sm font-bold text-emerald-950">
                        Rs {Number(order.totalAmount).toFixed(2)}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-500"
                            : order.status === "Pending"
                              ? "bg-orange-50 text-orange-500"
                              : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="rounded-lg bg-white/80 p-2 text-emerald-700/60">
                      <Eye size={15} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`rounded-[1.75rem] p-4 sm:p-5 ${vendorShell.card}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-emerald-950 sm:text-lg">Critical Stock</h3>
              <p className="mt-1 text-xs text-slate-600">Items below threshold (20)</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <AlertTriangle size={13} />
            </div>
          </div>

          <div className="space-y-4">
            {(stats.lowStockProducts || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-emerald-500/60">
                <Check size={22} className="mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">All stock levels are optimal</p>
              </div>
            ) : (
              stats.lowStockProducts.map((item, index) => (
                <div key={item._id || index} className="rounded-2xl border border-amber-100/70 bg-amber-50/65 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-emerald-950">{item.name}</span>
                    <span className="whitespace-nowrap rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-600">
                      {item.stock} left
                    </span>
                  </div>
                  <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
                    <div
                      className="h-1.5 rounded-full bg-orange-400"
                      style={{ width: `${Math.min((item.stock / 20) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-medium italic text-slate-600">Type: {item.category}</p>
                    <span className="text-[10px] font-bold text-emerald-600">Restock</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ title, product, setProduct, onClose, onSubmit, submitLabel, isSubmitting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-[1.9rem] ${vendorShell.card}`}>
        <div className="flex items-center justify-between rounded-t-[1.9rem] border-b border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
          <h2 className="pr-3 text-base font-bold text-emerald-950 sm:text-lg">{title}</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1 text-emerald-700/60 transition hover:bg-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Product Name
              </label>
              <input
                required
                disabled={isSubmitting}
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                placeholder="e.g. Paracetamol 500mg"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Category
              </label>
              <input
                disabled={isSubmitting}
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Price (Rs)
              </label>
              <input
                required
                disabled={isSubmitting}
                type="number"
                step="0.01"
                value={product.price || ""}
                onChange={(e) => setProduct({ ...product, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Stock Quantity
              </label>
              <input
                required
                disabled={isSubmitting}
                type="number"
                value={product.stock || ""}
                onChange={(e) => setProduct({ ...product, stock: e.target.value ? parseInt(e.target.value, 10) : 0 })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Expiry Date
              </label>
              <input
                required
                disabled={isSubmitting}
                type="date"
                value={product.expiry}
                onChange={(e) => setProduct({ ...product, expiry: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-emerald-50/70 p-3">
            <input
              disabled={isSubmitting}
              type="checkbox"
              id="rxRequired"
              checked={product.rxRequired}
              onChange={(e) => setProduct({ ...product, rxRequired: e.target.checked })}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 disabled:opacity-50"
            />
            <label htmlFor="rxRequired" className="cursor-pointer select-none text-sm font-semibold text-emerald-950">
              Prescription Required (Rx)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-emerald-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-700 transition hover:bg-emerald-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>{isSubmitting ? "Saving..." : submitLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VendorCatalogPage({ title, canManageInventory, inventoryMode = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "General",
    stock: 0,
    price: 0,
    expiry: "",
    rxRequired: false,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchVendorProducts();
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canManageInventory) {
      setLoading(false);
      return;
    }
    loadProducts();
  }, [canManageInventory]);

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await createVendorProduct(newProduct);
      setIsModalOpen(false);
      setNewProduct({
        name: "",
        category: "General",
        stock: 0,
        price: 0,
        expiry: "",
        rxRequired: false,
        description: "",
      });
      await loadProducts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await updateVendorProduct(editingProduct._id, editingProduct);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    await deleteVendorProduct(id);
    await loadProducts();
  };

  if (!canManageInventory) {
    return <PendingApprovalPanel vendor={{ status: "pending" }} />;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-emerald-950 sm:text-2xl">{title}</h1>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          {inventoryMode ? "Manage your pharmacy operations" : "Manage your pharmacy catalog"}
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[340px]">
          <input
            type="text"
            placeholder={inventoryMode ? "Search products..." : "Search our catalog..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
        >
          <Plus size={16} />
          <span>{inventoryMode ? "Add Product" : "Add New Medicine"}</span>
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 className="mb-3 h-7 w-7 animate-spin text-emerald-500" />
            <p className="text-sm">{inventoryMode ? "Loading inventory..." : "Loading catalog..."}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/70 py-16 text-center text-sm italic text-slate-600">
            {inventoryMode ? "No products found in inventory." : "Your catalog is currently empty."}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`rounded-[1.7rem] p-4 transition-all hover:-translate-y-0.5 sm:p-5 ${vendorShell.card}`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-base font-bold text-emerald-950 sm:text-lg">{product.name}</h3>
                    {product.rxRequired && (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                        Rx Required
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:gap-4">
                    <p className="break-words">
                      Category: <span className="font-medium text-emerald-500">{product.category}</span>
                    </p>
                    <p>
                      Stock:{" "}
                      <span className={`font-bold ${product.stock < 10 ? "text-orange-500" : "text-emerald-950"}`}>
                        {product.stock}
                      </span>
                    </p>
                    <p>
                      Expiry: <span className="font-medium text-emerald-950">{product.expiry}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-6">
                  <div className="sm:text-right">
                    <p className="text-lg font-bold text-emerald-950 sm:text-xl">Rs {Number(product.price).toFixed(2)}</p>
                    <p className="text-xs text-emerald-800/50">per unit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsEditModalOpen(true);
                      }}
                      className="rounded-lg bg-emerald-50 p-2 text-emerald-600 shadow-sm transition hover:bg-emerald-100"
                      title="Edit Medicine"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="rounded-lg bg-red-50 p-2 text-red-500 shadow-sm transition hover:bg-red-100"
                      title="Delete Medicine"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen ? (
        <ProductModal
          title={inventoryMode ? "Add New Product" : "Add New Medicine to Catalog"}
          product={newProduct}
          setProduct={setNewProduct}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProduct}
          submitLabel={inventoryMode ? "Save Product" : "Save Medicine"}
          isSubmitting={isSubmitting}
        />
      ) : null}

      {isEditModalOpen && editingProduct ? (
        <ProductModal
          title="Edit Medicine Details"
          product={editingProduct}
          setProduct={setEditingProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleEditProduct}
          submitLabel="Update Medicine"
          isSubmitting={isSubmitting}
        />
      ) : null}
    </div>
  );
}

function VendorOrdersPage({ canManageInventory, onOrdersUpdated }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("all");

  const loadOrders = async () => {
    try {
      const data = await fetchVendorOrders();
      const mapped = (data || []).map((order) => ({
        id: `#${order.orderId}`,
        rawId: order._id,
        status: order.status,
        customer: order.customerName,
        date: new Date(order.createdAt).toLocaleDateString(),
        address: "Address not available",
        items: order.items?.length || 0,
        total: order.totalAmount,
        paymentMethod: order.paymentMethod || "Cash on Delivery",
        cancellation: order.cancellation || null,
      }));
      setOrders(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canManageInventory) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [canManageInventory]);

  if (!canManageInventory) {
    return <PendingApprovalPanel vendor={{ status: "pending" }} />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-50";
      case "Processing":
        return "text-blue-600 bg-blue-50";
      case "Shipped":
        return "text-purple-600 bg-purple-50";
      case "Delivered":
        return "text-emerald-600 bg-emerald-50";
      case "Cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getActions = (status) => {
    if (status === "Pending") return ["accept", "deny"];
    if (status === "Processing") return ["ship"];
    return [];
  };

  const filteredOrders = orders.filter((order) => {
    const matchesView =
      view === "cancelled"
        ? order.status === "Cancelled"
        : view === "active"
          ? order.status !== "Cancelled"
          : true;

    if (!matchesView) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const searchableText = [
      order.id,
      order.status,
      order.customer,
      order.date,
      order.address,
      order.items,
      order.total,
      order.paymentMethod,
      order.cancellation?.byRole,
      order.cancellation?.reason,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  const hasActiveSearch = searchQuery.trim().length > 0;

  const handleStatusUpdate = async (orderId, payload) => {
    setUpdatingOrderId(orderId);
    try {
      await updateVendorOrderStatus(orderId, payload);
      await loadOrders();
      if (onOrdersUpdated) {
        await onOrdersUpdated();
      }
    } finally {
      setUpdatingOrderId("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-emerald-950 sm:text-2xl">Orders</h1>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">Manage your pharmacy operations</p>
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setView("all")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              view === "all" ? "bg-emerald-600 text-white" : "border border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50"
            }`}
          >
            All Orders
          </button>
          <button
            type="button"
            onClick={() => setView("active")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              view === "active" ? "bg-blue-600 text-white" : "border border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50"
            }`}
          >
            Active Orders
          </button>
          <button
            type="button"
            onClick={() => setView("cancelled")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              view === "cancelled" ? "bg-rose-600 text-white" : "border border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50"
            }`}
          >
            Cancelled Orders
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search orders by ID, customer, status, payment, or cancellation reason"
            className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:max-w-xl"
          />
          {hasActiveSearch ? (
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
              {filteredOrders.length} result{filteredOrders.length === 1 ? "" : "s"}
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            {view === "cancelled" ? "No cancelled orders found." : "No orders found."}
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const actions = getActions(order.status);
            return (
              <div key={index} className={`rounded-[1.7rem] p-4 sm:p-5 ${vendorShell.card}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-emerald-950 sm:text-lg">{order.id}</h3>
                      <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status === "Pending" && <Package size={11} />}
                        {(order.status === "Delivered" || order.status === "Processing") && <Check size={11} />}
                        <span>{order.status}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <span className="mb-1 block text-emerald-800/45">Customer:</span>
                        <span className="break-words font-medium text-emerald-950">{order.customer}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-emerald-800/45">Date:</span>
                        <span className="font-medium text-emerald-950">{order.date}</span>
                      </div>
                      <div className="xl:col-span-2">
                        <span className="mb-1 block text-emerald-800/45">Address:</span>
                        <span className="break-words font-medium text-emerald-950">{order.address}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-emerald-800/45">Items:</span>
                        <span className="font-medium text-emerald-950">{order.items} product(s)</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-emerald-800/45">Payment:</span>
                        <span className="font-medium text-emerald-950">{order.paymentMethod || "Cash on Delivery"}</span>
                      </div>
                    </div>
                    {order.cancellation?.byRole ? (
                      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <p className="font-semibold">Cancelled by {order.cancellation.byRole}</p>
                        <p className="mt-1">{order.cancellation.reason || "No reason provided"}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-emerald-100 pt-4 lg:ml-5 lg:min-w-[120px] lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <p className="text-lg font-bold text-emerald-950 sm:text-xl">Rs {Number(order.total).toFixed(2)}</p>
                    <div className="flex flex-wrap items-center justify-end gap-2 lg:max-w-[180px]">
                      {actions.includes("accept") && (
                        <button
                          type="button"
                          disabled={updatingOrderId === order.rawId}
                          onClick={() => handleStatusUpdate(order.rawId, { status: "Processing" })}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-60"
                        >
                          <Check size={16} />
                          <span>{updatingOrderId === order.rawId ? "Updating..." : "Accept"}</span>
                        </button>
                      )}
                      {actions.includes("deny") && (
                        <button
                          type="button"
                          disabled={updatingOrderId === order.rawId}
                          onClick={() =>
                            handleStatusUpdate(order.rawId, {
                              status: "Cancelled",
                              cancellation: {
                                byRole: "Vendor",
                                reason: "Rejected by vendor",
                                cancelledAt: new Date().toISOString(),
                              },
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      )}
                      {actions.includes("ship") && (
                        <button
                          type="button"
                          disabled={updatingOrderId === order.rawId}
                          onClick={() => handleStatusUpdate(order.rawId, { status: "Shipped" })}
                          className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-100 disabled:opacity-60"
                        >
                          <Truck size={16} />
                          <span>{updatingOrderId === order.rawId ? "Updating..." : "Ship"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function VendorSidebar({ vendor, canManageInventory, isCollapsed, toggleSidebar, onLogout }) {
  return (
    <aside
      className={`flex h-full flex-col transition-all duration-300 ${vendorShell.sidebar} ${
        isCollapsed ? "w-14 sm:w-16" : "w-44 sm:w-52"
      }`}
    >
      <div className="border-b border-white/10 p-3 sm:p-4">
        {!isCollapsed ? (
          <div>
            <h1 className="text-sm font-bold text-white sm:text-base">Vendor Portal</h1>
            <p className="mt-1 break-words text-[10px] text-emerald-50/70 sm:text-[11px]">
              {vendor.pharmacyName || "--"}
            </p>
            <div
              className={`mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium sm:text-[10px] ${
                canManageInventory
                  ? "border-emerald-200/30 bg-emerald-300/15 text-emerald-50"
                  : "border-amber-200/30 bg-amber-300/15 text-amber-100"
              }`}
            >
              {canManageInventory ? <CheckCircle2 size={10} /> : <Clock size={10} />}
              <span>{canManageInventory ? "Approved" : "Pending"}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white">
              <Store size={14} />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-4 sm:px-3">
        {navItems.map((item) => {
          const disabled = !canManageInventory && item.path !== "dashboard";

          if (disabled) {
            return (
              <div
                key={item.name}
                className={`flex items-center gap-2 rounded-xl px-2.5 py-2.5 ${vendorShell.sidebarSoft} sm:px-3`}
              >
                <item.icon size={15} />
                {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">{item.name}</span>}
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={`/vendor-dashboard/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-2.5 py-2.5 transition-colors sm:px-3 ${
                  isActive
                    ? vendorShell.sidebarActive
                    : vendorShell.sidebarIdle
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={15} className={isActive ? "text-emerald-700" : "text-emerald-50/70"} />
                  {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">{item.name}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-2 sm:p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-emerald-50/82 transition hover:bg-white/8 hover:text-white sm:px-3"
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">Collapse</span>}
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-rose-100 transition hover:bg-white/8 sm:px-3"
        >
          <LogOut size={15} />
          {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default function VendorPortal() {
  const navigate = useNavigate();
  const vendor = useMemo(() => getStoredVendor(), []);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    lowStockProducts: [],
    recentOrders: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await fetchVendorDashboardStats();
      setStats({
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        pendingOrders: data.pendingOrders || 0,
        lowStockCount: data.lowStockCount || 0,
        lowStockProducts: data.lowStockProducts || [],
        recentOrders: data.recentOrders || [],
      });
    } catch (error) {
      console.error("Error fetching vendor dashboard stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const data = await fetchVendorNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching vendor notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    if (!vendor || vendor.role !== "Vendor") {
      navigate("/vendor-login", { replace: true });
      return;
    }

    if (vendor.status !== "approved") {
      setStatsLoading(false);
      return;
    }

    loadStats();
    loadNotifications();
  }, [navigate, vendor]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileSidebarOpen]);

  if (!vendor || vendor.role !== "Vendor") {
    return null;
  }

  const canManageInventory = vendor.status === "approved";

  return (
    <div className={`flex min-h-screen font-sans ${vendorShell.page}`}>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition md:hidden ${
          isMobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-40 md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200`}
      >
        <VendorSidebar
          vendor={vendor}
          canManageInventory={canManageInventory}
          isCollapsed={false}
          toggleSidebar={() => setIsMobileSidebarOpen(false)}
          onLogout={() => {
            logoutVendor();
            navigate("/vendor-login", { replace: true });
          }}
        />
      </div>

      <div className="hidden md:block">
        <VendorSidebar
          vendor={vendor}
          canManageInventory={canManageInventory}
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed((current) => !current)}
          onLogout={() => {
            logoutVendor();
            navigate("/vendor-login", { replace: true });
          }}
        />
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-100 bg-white/78 px-4 py-3 shadow-sm backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 md:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800/45">Vendor Portal</p>
              <h1 className="truncate text-lg font-bold text-emerald-950">{vendor.pharmacyName || "Vendor"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell
              notifications={notifications}
              isOpen={notificationsOpen}
              loading={notificationsLoading}
              onClose={() => setNotificationsOpen(false)}
              onToggle={() => {
                const nextValue = !notificationsOpen;
                setNotificationsOpen(nextValue);
                if (nextValue) {
                  loadNotifications();
                }
              }}
              onMarkRead={async (id) => {
                await markVendorNotificationAsRead(id);
                setNotifications((current) =>
                  current.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
                );
              }}
              onMarkAllRead={async () => {
                await markAllVendorNotificationsAsRead();
                setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
              }}
              buttonClassName="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            />
            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm md:flex">
              <Store size={18} />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                canManageInventory ? (
                  <VendorDashboardPage stats={stats} loading={statsLoading} />
                ) : (
                  <PendingApprovalPanel vendor={vendor} />
                )
              }
            />
            <Route
              path="products"
              element={<VendorCatalogPage title="Products" canManageInventory={canManageInventory} />}
            />
            <Route
              path="inventory"
              element={
                <VendorCatalogPage
                  title="Inventory"
                  canManageInventory={canManageInventory}
                  inventoryMode
                />
              }
            />
            <Route
              path="orders"
              element={
                <VendorOrdersPage
                  canManageInventory={canManageInventory}
                  onOrdersUpdated={loadStats}
                />
              }
            />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
