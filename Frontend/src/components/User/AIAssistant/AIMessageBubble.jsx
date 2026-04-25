import React from "react";
import { Bot, UserRound } from "lucide-react";

function formatMessageTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}

export default function AIMessageBubble({ message }) {
  const isAssistant = message.role === "assistant";
  const paragraphs = String(message.text || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className={`flex gap-4 ${isAssistant ? "items-start" : "justify-end"}`}>
      {isAssistant ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-600 to-violet-500 text-white shadow-lg shadow-fuchsia-200">
          <Bot size={18} />
        </div>
      ) : null}

      <div className={`max-w-3xl ${isAssistant ? "" : "flex flex-col items-end"}`}>
        <div
          className={`rounded-[28px] px-5 py-4 shadow-sm ${
            isAssistant
              ? "bg-slate-100 text-slate-800"
              : "bg-linear-to-r from-emerald-500 to-teal-500 text-white"
          }`}
        >
          <div className="space-y-3 text-[15px] leading-7">
            {paragraphs.map((paragraph, index) => (
              <p key={`${message.id}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
        <p className="mt-2 px-2 text-xs text-slate-400">
          {formatMessageTime(message.timestamp)}
        </p>
      </div>

      {!isAssistant ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-200">
          <UserRound size={18} />
        </div>
      ) : null}
    </div>
  );
}
