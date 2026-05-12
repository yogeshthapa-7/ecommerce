// app/components/ui/ChatBubble.tsx
"use client";
import { useState } from "react";
import AssistantChat from "./assistantchat";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[2147483647] grid size-16 place-items-center rounded-full border border-white/30 bg-[#111827] text-white shadow-[0_20px_60px_rgba(0,0,0,0.38)] transition-colors duration-200 hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/45 md:bottom-6 md:right-6"
        aria-label="Toggle chat"
      >
        {/* Icon with rotation animation */}
        <div className={`transform transition-transform duration-300 ${open ? "rotate-180 scale-90" : "rotate-0 scale-100"}`}>
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </div>

        {/* Ripple Effect */}
        {!open && <span className="absolute inset-0 rounded-full border border-white/25 animate-ping opacity-70"></span>}
      </button>

      {/* Chat Window */}
      {open && (
        <>
          {/* Backdrop overlay for mobile */}
          <div 
            className="fixed inset-0 z-[2147483645] bg-black/45 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          ></div>
          
          {/* Chat Component */}
          <div className="relative z-[2147483646]">
            <AssistantChat />
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </>
  );
}
