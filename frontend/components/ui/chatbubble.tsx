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
        className="fixed bottom-6 right-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 group border-2 border-white/10"
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
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75"></span>
      </button>

      {/* Chat Window */}
      {open && (
        <>
          {/* Backdrop overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          ></div>
          
          {/* Chat Component */}
          <div className="z-50">
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