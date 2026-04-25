import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import NotificationBell from "./Notifications/NotificationBell.jsx";
import { clearAuthSession, getStoredUser, logoutUser } from "../services/auth.service.js";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service.js";
import {
  approveVendor,
  deleteAdminUser,
  deleteVendor,
  fetchAdminDashboard,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminReports,
  fetchAdminUsers,
  fetchVendorsForApproval,
} from "../services/admin.service.js";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { name: "Vendor Verification", icon: ShieldCheck, path: "verification" },
  { name: "Users", icon: Users, path: "users" },
  { name: "Vendors", icon: Store, path: "vendors" },
  { name: "Orders", icon: ShoppingBag, path: "orders" },
  { name: "Payments", icon: DollarSign, path: "payments" },
  { name: "Reports", icon: BarChart3, path: "reports" },
];

const cardStyles = {
  blue: "bg-blue-500 text-white",
  emerald: "bg-emerald-500 text-white",
  purple: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
};

const alertStyles = {
  warning: "border-amber-300 bg-amber-50 text-amber-800",
  info: "border-blue-300 bg-blue-50 text-blue-800",
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
};

const PAGE_SIZE = 10;

function formatMetricValue(card) {
  if (card.isCurrency) {
    const value = Number(card.value || 0);
    if (value >= 1000) {
      return `Rs ${(value / 1000).toFixed(1)}K`;
    }
    return `Rs ${value.toFixed(2)}`;
  }

  return Number(card.value || 0).toLocaleString();
}

function getOrderStatusTone(status) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-700";
    case "Cancelled":
      return "bg-rose-50 text-rose-700";
    case "Processing":
      return "bg-blue-50 text-blue-700";
    case "Shipped":
      return "bg-violet-50 text-violet-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function getSearchableText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((item) => getSearchableText(item)).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => getSearchableText(item))
      .join(" ");
  }

  return String(value);
}

function AdminSidebar({ adminName, onLogout, isLoggingOut, isMobileOpen, onClose }) {
  const sidebarBody = (
    <>
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-3 lg:block">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.7rem]">Admin Portal</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">{adminName || "Admin"}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
              <ShieldCheck size={16} />
              <span>Super Admin</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={`/admin-dashboard/${item.path}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition sm:px-5 sm:py-4 sm:text-[0.98rem] ${
                    isActive
                      ? "bg-linear-to-r from-fuchsia-500 to-violet-600 text-white shadow-[0_18px_40px_rgba(124,58,237,0.35)]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 px-3 py-4 sm:px-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-70 sm:px-5 sm:py-3.5 sm:text-[0.98rem]"
        >
          <LogOut size={18} />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/45 transition lg:hidden ${
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[19rem] max-w-[86vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 lg:static lg:z-auto lg:h-screen lg:w-[300px] lg:max-w-none lg:translate-x-0 lg:shadow-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarBody}
      </aside>
    </>
  );
}

function AdminTopbar({ onOpenMenu }) {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const currentSection = useMemo(
    () => menuItems.find((item) => location.pathname.includes(item.path))?.name || "Dashboard",
    [location.pathname],
  );

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8 lg:py-6">
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-700 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2.6rem]">
            {currentSection}
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base lg:mt-2 lg:text-[1.05rem]">
            Platform administration and management
          </p>
        </div>
      </div>
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
          await markNotificationAsRead(id);
          setNotifications((current) =>
            current.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
          );
        }}
        onMarkAllRead={async () => {
          await markAllNotificationsAsRead();
          setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
        }}
        buttonClassName="relative mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
      />
    </div>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchAdminDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-base text-slate-500 sm:p-10 sm:text-xl">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="m-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-base text-red-700 sm:m-10 sm:p-8 sm:text-lg">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:space-y-10 lg:p-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.summaryCards.map((card) => (
          <article
            key={card.key}
            className="rounded-[2rem] bg-white p-5 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-[1rem] sm:h-12 sm:w-12 ${cardStyles[card.tone]}`}>
                {card.key === "users" ? <Users size={22} /> : null}
                {card.key === "vendors" ? <Store size={22} /> : null}
                {card.key === "orders" ? <ShoppingBag size={22} /> : null}
                {card.key === "revenue" ? <DollarSign size={22} /> : null}
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 sm:px-4 sm:py-1.5 sm:text-lg">
                {card.change}
              </div>
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:mt-7 sm:text-[2.6rem]">
              {formatMetricValue(card)}
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">{card.label}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.75fr]">
        <section className="rounded-[2.25rem] bg-white p-5 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-8 lg:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2.25rem]">Recent Activity</h2>

          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            {dashboard.recentActivity.map((activity) => (
              <article
                key={activity.id}
                className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                      activity.type === "user"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "vendor"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    {activity.type === "user" ? <Users size={20} /> : null}
                    {activity.type === "vendor" ? <Store size={20} /> : null}
                    {activity.type === "order" ? <ShoppingBag size={20} /> : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 sm:text-[1.18rem]">{activity.title}</h3>
                    <p className="mt-1 break-words text-sm text-slate-500 sm:text-base">{activity.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 sm:text-base">{activity.timeAgo}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2.25rem] bg-white p-5 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2.1rem]">System Alerts</h2>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-500 sm:h-12 sm:w-12">
              <AlertTriangle size={22} />
            </div>
          </div>

          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            {dashboard.systemAlerts.map((alert) => (
              <article
                key={alert.id}
                className={`rounded-[1.6rem] border px-5 py-4 sm:px-6 sm:py-5 ${alertStyles[alert.tone]}`}
              >
                <h3 className="text-lg font-semibold sm:text-[1.35rem]">{alert.title}</h3>
                <p className="mt-2 text-sm opacity-90 sm:text-lg">{alert.subtitle}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DataTablePage({
  title,
  subtitle,
  columns,
  rows,
  loading,
  emptyText,
  actionRenderer,
  mobileSummary,
  searchPlaceholder,
  renderToolbar,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const hasActiveSearch = searchQuery.trim().length > 0;

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) => getSearchableText(row).toLowerCase().includes(query));
  }, [rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paginatedRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <section className="rounded-[2.25rem] bg-white p-5 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-8 lg:p-10">
        <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur sm:-mx-8 sm:-mt-8 sm:px-8 sm:py-6 lg:-mx-10 lg:-mt-10 lg:px-10 lg:py-7">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2.15rem]">{title}</h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-lg lg:text-xl">{subtitle}</p>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder || `Search ${title.toLowerCase()}...`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-200 sm:max-w-md"
              />
              {hasActiveSearch ? (
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
                  {filteredRows.length} result{filteredRows.length === 1 ? "" : "s"}
                </div>
              ) : null}
            </div>
            {renderToolbar ? <div className="flex flex-wrap gap-2">{renderToolbar()}</div> : null}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-base text-slate-500 sm:text-lg">Loading...</div>
        ) : filteredRows.length === 0 ? (
          <div className="mt-8 text-base text-slate-500 sm:text-lg">{emptyText}</div>
        ) : (
          <>
            <div className="mt-8 space-y-4 lg:hidden">
              {paginatedRows.map((row, index) => (
                <article
                  key={row.id || row._id || index}
                  className="rounded-[1.5rem] border border-slate-200 px-4 py-4"
                >
                  <div className="space-y-3">
                    {columns.map((column) => (
                      <div key={column.key} className="flex items-start justify-between gap-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {column.label}
                        </span>
                        <div className="min-w-0 break-words text-right text-sm text-slate-700">
                          {column.render ? column.render(row) : row[column.key]}
                        </div>
                      </div>
                    ))}
                    {mobileSummary ? <div>{mobileSummary(row)}</div> : null}
                    {actionRenderer ? <div className="pt-2">{actionRenderer(row)}</div> : null}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 hidden overflow-hidden rounded-[1.5rem] border border-slate-200 lg:block">
              <div
                className="grid bg-slate-50 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500"
                style={{ gridTemplateColumns: `${columns.map((column) => column.width || "1fr").join(" ")}${actionRenderer ? " auto" : ""}` }}
              >
                {columns.map((column) => (
                  <div key={column.key}>{column.label}</div>
                ))}
                {actionRenderer ? <div>Actions</div> : null}
              </div>
              <div className="divide-y divide-slate-200">
                {paginatedRows.map((row, index) => (
                  <div
                    key={row.id || row._id || index}
                    className="grid items-center px-6 py-5 text-[1.03rem] text-slate-700"
                    style={{ gridTemplateColumns: `${columns.map((column) => column.width || "1fr").join(" ")}${actionRenderer ? " auto" : ""}` }}
                  >
                    {columns.map((column) => (
                      <div key={column.key} className="min-w-0 break-words pr-3">
                        {column.render ? column.render(row) : row[column.key]}
                      </div>
                    ))}
                    {actionRenderer ? <div className="min-w-0">{actionRenderer(row)}</div> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  First
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function VendorVerificationPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVendors = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchVendorsForApproval();
      setVendors(data || []);
    } catch (err) {
      setError(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const pendingVendors = vendors.filter((vendor) => vendor.status !== "approved");

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <section className="rounded-[2.25rem] bg-white p-5 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-8 lg:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2.15rem]">Vendor Verification</h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-lg lg:text-xl">
          Vendors are approved here before inventory becomes available to them.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-base text-red-700 sm:text-lg">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-8 text-base text-slate-500 sm:text-lg">Loading vendor registrations...</div>
        ) : pendingVendors.length === 0 ? (
          <div className="mt-8 text-base text-slate-500 sm:text-lg">No pending vendor registrations right now.</div>
        ) : (
          <div className="mt-8 space-y-5">
            {pendingVendors.map((vendor) => (
              <article
                key={vendor._id}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-slate-900 sm:text-[1.35rem]">{vendor.pharmacyName}</h3>
                  <p className="mt-1 break-words text-sm text-slate-500 sm:text-lg">
                    {vendor.ownerName} • {vendor.email} • {vendor.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await approveVendor(vendor._id);
                      await loadVendors();
                    } catch (err) {
                      setError(err.message || "Failed to approve vendor");
                    }
                  }}
                  className="w-full rounded-2xl bg-violet-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-violet-700 sm:w-auto sm:py-4 sm:text-lg"
                >
                  Approve Vendor
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchAdminUsers());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DataTablePage
      title="Users"
      subtitle="All registered admins and customers."
      loading={loading}
      rows={rows}
      emptyText="No users found."
      columns={[
        { key: "name", label: "Name", width: "1.25fr" },
        { key: "email", label: "Email", width: "1.4fr" },
        { key: "role", label: "Role", width: "0.7fr" },
        { key: "userName", label: "User Name", width: "1fr" },
      ]}
      searchPlaceholder="Search users by name, email, role, or username"
      actionRenderer={(row) => (
        <button
          type="button"
          onClick={async () => {
            if (!window.confirm(`Delete ${row.name}?`)) return;
            await deleteAdminUser(row._id);
            setRows((current) => current.filter((user) => user._id !== row._id));
          }}
          className="w-full rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 lg:w-auto"
        >
          Delete
        </button>
      )}
    />
  );
}

function VendorsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchVendorsForApproval());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DataTablePage
      title="Vendors"
      subtitle="Registered pharmacy partners and their approval status."
      loading={loading}
      rows={rows}
      emptyText="No vendors found."
      columns={[
        { key: "pharmacyName", label: "Pharmacy", width: "1.2fr" },
        { key: "ownerName", label: "Owner", width: "1fr" },
        { key: "email", label: "Email", width: "1.3fr" },
        { key: "status", label: "Status", width: "0.8fr" },
      ]}
      searchPlaceholder="Search vendors by pharmacy, owner, email, or status"
      actionRenderer={(row) => (
        <button
          type="button"
          onClick={async () => {
            if (!window.confirm(`Delete vendor ${row.pharmacyName}?`)) return;
            await deleteVendor(row._id);
            setRows((current) => current.filter((vendor) => vendor._id !== row._id));
          }}
          className="w-full rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 lg:w-auto"
        >
          Delete
        </button>
      )}
    />
  );
}

function OrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchAdminOrders());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredRows = useMemo(() => {
    if (view === "cancelled") {
      return rows.filter((row) => row.status === "Cancelled");
    }

    if (view === "active") {
      return rows.filter((row) => row.status !== "Cancelled");
    }

    return rows;
  }, [rows, view]);

  return (
    <DataTablePage
      title="Orders"
      subtitle="Platform order activity coming from the vendor system."
      loading={loading}
      rows={filteredRows}
      emptyText={view === "cancelled" ? "No cancelled orders found." : "No orders found."}
      searchPlaceholder="Search orders by order ID, customer, status, payment method, or cancellation reason"
      renderToolbar={() => (
        <>
          <button
            type="button"
            onClick={() => setView("all")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              view === "all" ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Orders
          </button>
          <button
            type="button"
            onClick={() => setView("active")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              view === "active" ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setView("cancelled")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              view === "cancelled" ? "bg-rose-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cancelled
          </button>
        </>
      )}
      columns={[
        { key: "orderId", label: "Order", width: "1fr" },
        { key: "customerName", label: "Customer", width: "1fr" },
        {
          key: "status",
          label: "Status",
          width: "0.8fr",
          render: (row) => (
            <div className="space-y-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusTone(row.status)}`}>
                {row.status}
              </span>
              {row.cancellation?.byRole ? (
                <p className="text-xs text-slate-500">By {row.cancellation.byRole}</p>
              ) : null}
            </div>
          ),
        },
        {
          key: "totalAmount",
          label: "Amount",
          width: "0.8fr",
          render: (row) => `Rs ${Number(row.totalAmount || 0).toFixed(2)}`,
        },
        { key: "paymentMethod", label: "Method", width: "1fr" },
      ]}
      mobileSummary={(row) =>
        row.cancellation?.byRole ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Cancelled by {row.cancellation.byRole}: {row.cancellation.reason || "No reason provided"}
          </div>
        ) : null
      }
    />
  );
}

function PaymentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchAdminPayments());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DataTablePage
      title="Payments"
      subtitle="Payment-facing view generated from the current order stream."
      loading={loading}
      rows={rows}
      emptyText="No payments found."
      columns={[
        { key: "orderId", label: "Order", width: "1fr" },
        { key: "customerName", label: "Customer", width: "1fr" },
        { key: "paymentStatus", label: "Payment", width: "0.8fr" },
        { key: "paymentMethod", label: "Method", width: "1fr" },
        {
          key: "amount",
          label: "Amount",
          width: "0.8fr",
          render: (row) => `Rs ${Number(row.amount || 0).toFixed(2)}`,
        },
      ]}
      searchPlaceholder="Search payments by order ID, customer, method, or payment status"
    />
  );
}

function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setReport(await fetchAdminReports());
      } catch (err) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-base text-slate-500 sm:p-10 sm:text-xl">Loading reports...</div>;
  }

  if (error) {
    return <div className="m-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-base text-red-700 sm:m-10 sm:p-8 sm:text-lg">{error}</div>;
  }

  const safeReport = {
    userBreakdown: {
      customers: report?.userBreakdown?.customers ?? 0,
      admins: report?.userBreakdown?.admins ?? 0,
    },
    vendorBreakdown: {
      approved: report?.vendorBreakdown?.approved ?? 0,
      pending: report?.vendorBreakdown?.pending ?? 0,
    },
    orderBreakdown: {
      total: report?.orderBreakdown?.total ?? 0,
      delivered: report?.orderBreakdown?.delivered ?? 0,
      pending: report?.orderBreakdown?.pending ?? 0,
    },
  };

  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3 lg:p-10">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-[1.8rem]">User Breakdown</h2>
        <p className="mt-4 text-base text-slate-500 sm:text-xl">Customers: {safeReport.userBreakdown.customers}</p>
        <p className="mt-2 text-base text-slate-500 sm:text-xl">Admins: {safeReport.userBreakdown.admins}</p>
      </section>
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-[1.8rem]">Vendor Breakdown</h2>
        <p className="mt-4 text-base text-slate-500 sm:text-xl">Approved: {safeReport.vendorBreakdown.approved}</p>
        <p className="mt-2 text-base text-slate-500 sm:text-xl">Pending: {safeReport.vendorBreakdown.pending}</p>
      </section>
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_20px_45px_rgba(148,163,184,0.18)] sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-[1.8rem]">Order Breakdown</h2>
        <p className="mt-4 text-base text-slate-500 sm:text-xl">Total: {safeReport.orderBreakdown.total}</p>
        <p className="mt-2 text-base text-slate-500 sm:text-xl">Delivered: {safeReport.orderBreakdown.delivered}</p>
        <p className="mt-2 text-base text-slate-500 sm:text-xl">Pending: {safeReport.orderBreakdown.pending}</p>
      </section>
    </div>
  );
}

export default function AdminPage() {
  const [adminName, setAdminName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "Admin") {
      navigate("/admin-login", { replace: true });
      return;
    }

    setAdminName(user.name || "Admin");
  }, [navigate]);

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
    <div className="flex min-h-screen bg-[#f7f8fc] text-slate-900">
      <AdminSidebar
        adminName={adminName}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMenu={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="verification" element={<VendorVerificationPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
