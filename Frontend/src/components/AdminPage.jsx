import { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  BarChart3,
  LogOut,
} from "lucide-react";
import { clearAuthSession, logoutUser } from "../services/auth.service.js";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { name: "Vendor Verification", icon: ShieldCheck, path: "verification" },
  { name: "Users", icon: Users, path: "users" },
  { name: "Vendors", icon: Store, path: "vendors" },
  { name: "Orders", icon: ShoppingBag, path: "orders" },
  { name: "Payments", icon: DollarSign, path: "payments" },
  { name: "Reports", icon: BarChart3, path: "reports" },
];

const stats = [
  { label: "Active Users", value: "12.4K", change: "+8.2%" },
  { label: "Verified Vendors", value: "318", change: "+12.1%" },
  { label: "Orders Today", value: "1,284", change: "+5.4%" },
  { label: "Revenue", value: "$48.2K", change: "+9.7%" },
];

function Sidebar({ onLogout, isLoggingOut }) {
  return (
    <div className="w-54 h-screen bg-white border-r flex flex-col">
      <div className="px-4 py-6 border-b">
        <h1 className="text-lg font-semibold">Admin Portal</h1>
        <p className="text-sm text-gray-500">Admin</p>

        <div className="mt-4 bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm font-medium w-fit">
          Super Admin
        </div>
      </div>

      <div className="flex flex-col mt-4 gap-2 px-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={`/admin-dashboard/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-linear-to-r from-purple-500 to-indigo-500 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto border-t px-3 py-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogOut size={20} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ adminName }) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-indigo-900 p-8 text-white shadow-lg">
        <h1 className="mt-3 text-3xl font-semibold">Welcome back, {adminName}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Platform administration and management in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</h2>
            <p className="mt-2 text-sm font-medium text-emerald-600">{stat.change} this week</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        This section is ready for the next component to be connected.
      </p>
    </div>
  );
}

export default function AdminPage() {
  const [adminName, setAdminName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/admin-login");
      return;
    }

    const user = JSON.parse(stored);
    if (!user || user.role !== "Admin") {
      navigate("/admin-login");
      return;
    }

    setAdminName(user.name || "Admin");
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthSession();
      navigate("/admin-login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      <main className="flex-1 p-6 md:p-8">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard adminName={adminName} />} />
          <Route path="verification" element={<PlaceholderPage title="Vendor Verification" />} />
          <Route path="users" element={<PlaceholderPage title="Users" />} />
          <Route path="vendors" element={<PlaceholderPage title="Vendors" />} />
          <Route path="orders" element={<PlaceholderPage title="Orders" />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
