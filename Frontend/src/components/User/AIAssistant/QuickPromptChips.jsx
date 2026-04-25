import React from "react";

export default function QuickPromptChips({ prompts, onSelect, disabled = false }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="w-full rounded-[22px] bg-slate-100 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="block break-words">{prompt}</span>
        </button>
      ))}
    </div>
  );
}
