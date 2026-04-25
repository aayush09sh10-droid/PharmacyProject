import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, ShieldAlert, Sparkles, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PharmaHeader from "../../Layout/PharmaHeader.jsx";
import PharmaFooter from "../../Layout/PharmaFooter.jsx";
import BackButton from "../../Layout/BackButton.jsx";
import AIMessageBubble from "./AIMessageBubble.jsx";
import QuickPromptChips from "./QuickPromptChips.jsx";
import { askAiAssistant } from "../../../services/aiAssistant.service.js";

const quickPrompts = [
  "Find cheap medications near me",
  "What are common side effects of antibiotics?",
  "How can I refill my prescription?",
  "Find 24-hour pharmacies",
];

const starterMessage = {
  id: "welcome-message",
  role: "assistant",
  text: [
    "Hello! I'm your PharmaCare AI Assistant. I can help you with:",
    "• Finding medications and their prices",
    "• Understanding side effects and interactions",
    "• Locating nearby pharmacies",
    "• General health and wellness questions",
    "",
    "How can I assist you today?",
  ].join("\n"),
  timestamp: new Date(),
};

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    timestamp: new Date(),
  };
}

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([starterMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const submitPrompt = async (rawPrompt) => {
    const prompt = rawPrompt.trim();

    if (!prompt || isLoading) {
      return;
    }

    const userMessage = createMessage("user", prompt);
    setMessages((current) => [...current, userMessage]);
    setInputValue("");
    setError("");
    setIsLoading(true);

    try {
      const data = await askAiAssistant(prompt);
      const assistantMessage = createMessage("assistant", data.reply);
      setMessages((current) => [...current, assistantMessage]);
    } catch (requestError) {
      setError(requestError.message || "Failed to get a response from the AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitPrompt(inputValue);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#f3f7fb_100%)] text-slate-900">
      <PharmaHeader activePage="ai" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton label="Back to Home" onClick={() => navigate("/")} />
        </div>

        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
          <div className="bg-linear-to-r from-fuchsia-700 via-violet-600 to-blue-600 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-white shadow-lg">
                  <Sparkles size={30} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                    <Bot size={16} />
                    PharmaCare Intelligence
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">AI Assistant</h1>
                  <p className="mt-2 max-w-2xl text-sm text-violet-100 sm:text-base">
                    Ask medication, pharmacy, and wellness questions in a familiar chat experience built into your user portal.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-violet-100">
                    <Stethoscope size={16} />
                    Medication help
                  </div>
                  <p className="mt-2 text-sm text-white">Quick explanations for common medicine and refill questions.</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-violet-100">
                    <ShieldAlert size={16} />
                    Safe guidance
                  </div>
                  <p className="mt-2 text-sm text-white">For urgent symptoms or prescription changes, contact a doctor or pharmacist.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
            <div className="space-y-6">
              <div className="max-h-[30rem] space-y-5 overflow-y-auto pr-1">
                {messages.map((message) => (
                  <AIMessageBubble key={message.id} message={message} />
                ))}

                {isLoading ? (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-600 to-violet-500 text-white shadow-lg shadow-fuchsia-200">
                      <Bot size={18} />
                    </div>
                    <div className="rounded-[28px] bg-slate-100 px-5 py-4 text-slate-600 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-400" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-400 [animation-delay:120ms]" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-400 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div ref={messagesEndRef} />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-6 py-7 sm:px-8">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-base font-medium text-slate-700">Quick questions:</p>
              <div className="mt-4">
                <QuickPromptChips prompts={quickPrompts} onSelect={submitPrompt} disabled={isLoading} />
              </div>
            </div>

            <form className="mt-6 flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
              <div className="flex-1 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask me anything about medications, pharmacies, or health..."
                  className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-[24px] bg-linear-to-r from-violet-500 to-fuchsia-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      <PharmaFooter />
    </div>
  );
}
