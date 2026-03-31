import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Active Users", value: "12.4K", change: "+8.2%" },
  { label: "Verified Vendors", value: "318", change: "+12.1%" },
  { label: "Orders Today", value: "1,284", change: "+5.4%" },
  { label: "Revenue", value: "$48.2K", change: "+9.7%" },
];

export default function AdminPage() {
  const [adminName, setAdminName] = useState("");
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex flex-col md:flex-row min-h-screen">
        <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900">Admin Portal</h2>
            <p className="text-sm text-slate-500 mt-1">Super Admin</p>
          </div>

          <nav className="space-y-2">
            {["Dashboard", "Vendor Verification", "Users", "Vendors", "Orders", "Payments", "Reports"].map((item) => (
              <div key={item} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50">
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <div className="rounded-3xl bg-white p-8 shadow-sm mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Welcome, {adminName}</h1>
            <p className="mt-3 text-slate-500">You are now logged in as an administrator.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</h2>
                <p className="mt-2 text-sm font-medium text-emerald-600">{stat.change} this week</p>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
