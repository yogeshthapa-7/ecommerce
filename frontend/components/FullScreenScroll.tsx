import React from "react";
import { FullScreenScrollFX, FullScreenFXAPI } from "@/components/ui/screenScroll";


const sections = [
  {
    leftLabel: "Performance",
    title: <>Defy Gravity</>,
    rightLabel: "Performance",
    background: "https://images.stockcake.com/public/6/4/f/64fbf649-cc7c-40c7-b84e-b4468b4f18a8_large/floating-minimal-sneaker-stockcake.jpg",
    audioSrc: "/sfx/click-01.mp3",
  },
  {
    leftLabel: "Innovation",
    title: <>Stay Cool</>,
    rightLabel: "Innovation",
    background: "https://e1.pxfuel.com/desktop-wallpaper/247/147/desktop-wallpaper-nike-sb-backgrounds-awesome-cool-nike-browse-nike-sb-pc.jpg",
    audioSrc: "/sfx/whoosh-02.mp3",
  },
  {
    leftLabel: "Victory",
    title: <>Just Do It</>,
    rightLabel: "Victory",
    background: "https://e0.pxfuel.com/wallpapers/400/428/desktop-wallpaper-nike-purple-just-do-it-nike-drip.jpg",
    audioSrc: "/sfx/whoosh-02.mp3",
  },
  {
    leftLabel: "Challenge",
    title: <>Opportunity</>,
    rightLabel: "Challenge",
    background: "https://www.shutterstock.com/image-photo/nike-air-max-versus-adidas-600nw-2716943019.jpg",
    audioSrc: "/sfx/whoosh-02.mp3",
  },
];

export default function DemoOne() {
  const apiRef = React.useRef<FullScreenFXAPI>(null);

  return (
    <>
      <FullScreenScrollFX
        sections={ sections }
        header={<><div>Nike Series</div><div>2026</div></>}
        footer={<div></div>}
        showProgress
        durations={{ change: 0.7, snap: 800 }}
      />
    </>
  );
}