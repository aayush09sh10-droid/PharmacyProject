const stats = [
  { label: "Active Users", value: "12.4K", change: "+8.2%" },
  { label: "Verified Vendors", value: "318", change: "+12.1%" },
  { label: "Orders Today", value: "1,284", change: "+5.4%" },
  { label: "Revenue", value: "$48.2K", change: "+9.7%" },
];

function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-8 text-white shadow-lg">
        {/* <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Overview</p> */}
        <h1 className="mt-3 text-3xl font-semibold">Dashboard</h1>
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

export default Dashboard;
