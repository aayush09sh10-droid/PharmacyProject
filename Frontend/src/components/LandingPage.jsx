import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  CircleHelp,
  HeartPulse,
  Home,
  LogIn,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

function NavItem({ icon: Icon, label, active = false }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4fbf9] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-200">
              <HeartPulse size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none text-emerald-700">
                PharmaCare
              </h1>
              <p className="mt-1 text-xs text-slate-500">Your Health Partner</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavItem icon={Home} label="Home" active />
            <NavItem icon={CircleHelp} label="About" />
            <NavItem icon={CircleHelp} label="Support" />
            <NavItem icon={Bot} label="AI Assistant" />
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:opacity-95"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[24px] bg-linear-to-r from-[#06c48d] via-[#08b084] to-[#04986c] p-6 text-white shadow-[0_25px_60px_rgba(6,196,141,0.22)] sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
              <Sparkles size={16} />
              Find medicines nearby
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Find Your Nearest Pharmacy
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
              Search for medicines, compare prices across pharmacies, and order
              from the best deals.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              <MapPin size={16} />
              <span>Enable Location</span>
            </button>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-md">
              <Search size={18} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Search Medicine</h3>
              <p className="mt-1 text-sm text-slate-500">
                Find specific medicines and compare prices
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-emerald-200 px-4 py-4">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Azithromycin, Aspirin, Metformin..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                readOnly
              />
            </div>
            <button
              type="button"
              className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-100"
            >
              Search Medicine
            </button>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
          <h3 className="text-xl font-semibold text-slate-900">Filter by Price Range</h3>

          <div className="mt-5 grid gap-4 text-sm text-slate-500 sm:grid-cols-2">
            <p>Minimum Price: $0</p>
            <p className="sm:text-right">Maximum Price: $100</p>
          </div>

          <div className="mt-4 space-y-4">
            <div className="h-2 rounded-full bg-emerald-100">
              <div className="h-2 w-1/2 rounded-full bg-linear-to-r from-emerald-400 to-teal-400" />
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
              Tip: Showing medicines priced between <span className="font-semibold">$0</span>{" "}
              and <span className="font-semibold">$100</span>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-emerald-500" />
            <h3 className="text-3xl font-semibold text-slate-900">Nearby Pharmacies</h3>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              0
            </div>
          </div>

          <article className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="flex min-h-56 flex-col items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <MapPin size={24} />
              </div>
              <h4 className="mt-5 text-2xl font-semibold text-slate-900">
                No pharmacy is registered
              </h4>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Nearby pharmacy count is currently <span className="font-semibold text-emerald-700">0</span>.
                We will connect the pharmacy listings soon, and registered pharmacies
                will appear here after backend integration.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
