import React from "react";

export default function QuickPromptChips({ prompts, onSelect, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-3">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
