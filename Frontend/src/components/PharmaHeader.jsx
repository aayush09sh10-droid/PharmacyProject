import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  CircleHelp,
  HeartPulse,
  Home,
  LogIn,
  Menu,
  ShoppingCart,
} from "lucide-react";

function NavItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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

export default function PharmaHeader({ activePage = "home" }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => navigate("/")}
        >
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
          <NavItem
            icon={Home}
            label="Home"
            active={activePage === "home"}
            onClick={() => navigate("/")}
          />
          <NavItem
            icon={CircleHelp}
            label="About"
            active={activePage === "about"}
            onClick={() => navigate("/about")}
          />
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
  );
}
