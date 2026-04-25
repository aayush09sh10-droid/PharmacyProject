import React from "react";
import { BarChart3, TrendingUp, X } from "lucide-react";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`;
}

export default function RevenueInsightsModal({
  title,
  subtitle,
  timeline = [],
  summary = {},
  isOpen,
  onClose,
  accent = "emerald",
}) {
  if (!isOpen) {
    return null;
  }

  const maxValue = Math.max(...timeline.map((item) => Number(item.amount || 0)), 1);
  const accentStyles = {
    emerald: {
      panel: "from-emerald-500 to-teal-500",
      soft: "bg-emerald-50 text-emerald-700",
      bar: "from-emerald-500 to-teal-500",
    },
    violet: {
      panel: "from-violet-500 to-fuchsia-500",
      soft: "bg-violet-50 text-violet-700",
      bar: "from-violet-500 to-fuchsia-500",
    },
  };
  const palette = accentStyles[accent] || accentStyles.emerald;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <div className={`flex items-start justify-between gap-4 bg-linear-to-r ${palette.panel} px-6 py-6 text-white sm:px-8`}>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
              <BarChart3 size={16} />
              Revenue Insights
            </div>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">{title}</h2>
            <p className="mt-2 text-sm text-white/85 sm:text-base">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className={`rounded-2xl px-4 py-4 ${palette.soft}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">Total Revenue</p>
              <p className="mt-3 text-lg font-bold sm:text-xl">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Average Daily</p>
              <p className="mt-3 text-lg font-bold sm:text-xl">{formatCurrency(summary.averageDailyRevenue)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Latest Day</p>
              <p className="mt-3 text-lg font-bold sm:text-xl">{formatCurrency(summary.latestDayRevenue)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Peak Day</p>
              <p className="mt-3 text-lg font-bold sm:text-xl">{summary.peakRevenueDay || "N/A"}</p>
              <p className="mt-1 text-sm text-slate-500">{formatCurrency(summary.peakRevenueAmount)}</p>
            </div>
          </div>

          <section className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-slate-700">
              <TrendingUp size={18} />
              <h3 className="text-lg font-semibold">Last 7 Days</h3>
            </div>

            <div className="mt-6 grid h-[260px] grid-cols-7 items-end gap-3">
              {timeline.map((point) => (
                <div key={point.key} className="flex min-w-0 flex-col items-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-500">{point.amount > 0 ? `Rs ${Math.round(point.amount)}` : "Rs 0"}</span>
                  <div className="flex h-[180px] w-full items-end rounded-2xl bg-white px-2 py-2 shadow-sm">
                    <div
                      className={`w-full rounded-xl bg-linear-to-t ${palette.bar}`}
                      style={{ height: `${Math.max((Number(point.amount || 0) / maxValue) * 100, point.amount > 0 ? 12 : 6)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-700">{point.label}</p>
                    <p className="text-[11px] text-slate-400">{point.fullLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
