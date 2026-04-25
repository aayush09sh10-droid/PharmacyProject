import React from "react";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="sticky top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/92 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:text-emerald-800"
    >
      <ArrowLeft size={15} />
      <span>{label}</span>
    </button>
  );
}
