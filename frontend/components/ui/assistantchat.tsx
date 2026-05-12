"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useCart } from "@/app/context/CartContext";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const query = input;
    const userMsg: Message = { role: "user", text: query };
    const nextMessages = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          history: nextMessages.slice(-10),
        }),
      });
      const data = await res.json();

      if (data.cartAction?.product) {
        addToCart(
          data.cartAction.product,
          data.cartAction.selectedColor || null,
          data.cartAction.selectedSize || "",
          data.cartAction.quantity || 1,
        );
      }

      const aiMsg: Message = {
        role: "assistant",
        text: data.answer || "Unable to get a response. Please try again.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-[2147483646] flex max-h-[min(720px,calc(100svh-7.5rem))] w-[calc(100vw-2rem)] max-w-[430px] flex-col overflow-hidden rounded-[1.75rem] border border-white/65 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.42)] animate-slideUp md:right-6">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#111827] px-5 py-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/10">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-black tracking-normal">AI Assistant</h3>
            <p className="text-xs font-medium text-white/72">Always here to help</p>
          </div>
        </div>
        <div className="size-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
      </div>

      <div className="min-h-[330px] flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(17,24,39,0.08),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-5 py-5 text-slate-900 md:min-h-[390px]">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <svg className="mb-4 size-16 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-black text-slate-500">Start a conversation</p>
            <p className="mt-1 text-xs font-medium">Ask me anything!</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                m.role === "user"
                  ? "rounded-br-sm bg-[#111827] text-white"
                  : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
              }`}
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
              ) : (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex space-x-2">
                <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="flex items-end space-x-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Type your message..."
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#111827] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Send message"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.24s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.24s ease-out;
        }
      `}</style>
    </div>
  );
}
