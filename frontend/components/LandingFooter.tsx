"use client";

import { CinematicFooter } from "@/components/ui/motion-footer";

export default function Demo() {
  return (
    <div className="relative w-full bg-background h-[65vh] font-sans selection:bg-white/20 overflow-x-hidden">

      {/* The Cinematic Footer is injected here */}
      <CinematicFooter />

    </div>
  );
}