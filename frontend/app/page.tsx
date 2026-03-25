"use client"

import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: #000; color: #fff; overflow-x: hidden; cursor: none; }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }

  :root {
    --white: #ffffff;
    --black: #000000;
    --dim: rgba(255,255,255,0.08);
    --muted: rgba(255,255,255,0.35);
  }

  .cursor {
    position: fixed; pointer-events: none; z-index: 9999; mix-blend-mode: difference;
    top: 0; left: 0;
  }
  .cursor-dot {
    width: 8px; height: 8px; background: #fff; border-radius: 50%;
    position: absolute; transform: translate(-50%, -50%);
  }
  .cursor-ring {
    width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.5); border-radius: 50%;
    position: absolute; transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease, opacity 0.3s;
  }
  .cursor-ring.hover { width: 64px; height: 64px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(80px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.04; }
    50% { opacity: 0.08; }
  }
  @keyframes floatUp {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }
  @keyframes rotateSlow {
    from { transform: translate(-50%,-50%) rotate(0deg); }
    to { transform: translate(-50%,-50%) rotate(360deg); }
  }
  @keyframes rotateSlow2 {
    from { transform: translate(-50%,-50%) rotate(0deg); }
    to { transform: translate(-50%,-50%) rotate(-360deg); }
  }
  @keyframes scanDown {
    0% { top: -2px; opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes glitch {
    0%, 88%, 100% { clip-path: none; transform: none; }
    90% { clip-path: polygon(0 18%, 100% 18%, 100% 32%, 0 32%); transform: translate(-5px, 0); }
    92% { clip-path: polygon(0 58%, 100% 58%, 100% 74%, 0 74%); transform: translate(5px, 0); }
    94% { clip-path: none; transform: none; }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0,0); }
    10% { transform: translate(-2%,-3%); }
    30% { transform: translate(3%, 2%); }
    50% { transform: translate(-1%, 4%); }
    70% { transform: translate(2%,-1%); }
    90% { transform: translate(-3%, 1%); }
  }
  @keyframes drawLine {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  .reveal {
    opacity: 0; transform: translateY(50px);
    transition: opacity 0.95s cubic-bezier(0.16,1,0.3,1), transform 0.95s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.in { opacity: 1; transform: translateY(0); }
  .reveal-d1 { transition-delay: 0.12s; }
  .reveal-d2 { transition-delay: 0.26s; }
  .reveal-d3 { transition-delay: 0.42s; }

  .grain-overlay {
    position: fixed; inset: -50%; width: 200%; height: 200%;
    pointer-events: none; z-index: 9997; opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grain 0.4s steps(1) infinite;
  }

  .btn-cta {
    display: inline-flex; align-items: center; gap: 18px;
    background: #fff; color: #000; border: none;
    padding: 20px 56px;
    font-family: 'Anton', sans-serif;
    font-size: 17px; letter-spacing: 3px; text-transform: uppercase;
    cursor: none; position: relative; overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.3s ease;
  }
  .btn-cta::after {
    content: ''; position: absolute; inset: 0;
    background: #111; transform: translateX(-101%);
    transition: transform 0.45s cubic-bezier(0.77,0,0.175,1);
  }
  .btn-cta:hover { transform: scale(1.02); box-shadow: 0 24px 80px rgba(255,255,255,0.12); }
  .btn-cta:hover::after { transform: translateX(0); }
  .btn-cta .label { position: relative; z-index: 1; }
  .btn-cta .arrow { position: relative; z-index: 1; font-size: 22px; line-height: 1; }
  .btn-cta:hover .label, .btn-cta:hover .arrow { color: #fff; }

  .chapter {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; letter-spacing: 5px;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
    display: flex; align-items: center; gap: 16px;
  }
  .chapter::before {
    content: ''; display: block; width: 36px; height: 1px;
    background: rgba(255,255,255,0.25);
    transform-origin: left; animation: drawLine 0.8s ease 0.3s both;
  }
`;

function Swoosh({ size = 80, color = "#fff", style = {} }) {
  return (
    <svg width={size} height={size * 0.375} viewBox="0 0 80 30" fill="none" style={style}>
      <path d="M0 24L52 1C56.5-0.8 62 1.2 63.5 5.8C65 10.5 62.3 15.5 57.5 17.3L16 24H0Z" fill={color} />
    </svg>
  );
}

export default function NikeLanding() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Cursor
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e) => setHovering(!!e.target.closest("button,a,[data-hover]"));
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", onOver); };
  }, []);

  // Scroll
  useEffect(() => {
    const s = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  const heroFade = Math.min(scrollY / 500, 1);

  return (
    <>
      <style>{STYLES}</style>
      <div className="grain-overlay" />

      {/* Custom cursor */}
      <div className="cursor" style={{ transform: `translate(${pos.x}px,${pos.y}px)` }}>
        <div className="cursor-dot" />
        <div className={`cursor-ring${hovering ? " hover" : ""}`} />
      </div>

      {/* ══════════════════════════════════ HERO ══ */}
      <section style={{
        height: "100vh", position: "relative",
        overflow: "hidden", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* BG image */}
        <img
          src="https://img3.wallspic.com/crops/5/5/2/6/4/146255/146255-shoe-black-darkness-nike-graphic_design-3840x2160.jpg"
          alt="Nike Background"
          loading="eager"
          decoding="async"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            filter: "brightness(0.25) contrast(1.1) saturate(0.55)",
            transform: `scale(1.08) translateY(${heroFade * 55}px)`,
          }}
        />

        {/* Layered overlays */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.95) 100%)" }} />

        {/* Scanline */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
          animation: "scanDown 5s linear infinite",
          pointerEvents: "none",
        }} />

        {/* Hero text */}
        <div style={{
          position: "relative", zIndex: 2, textAlign: "center",
          opacity: loaded ? Math.max(0, 1 - heroFade * 1.6) : 0,
          transform: `translateY(${heroFade * -50}px)`,
          transition: "opacity 0.06s linear",
        }}>
          <div
            style={{
              display: "flex", justifyContent: "center", marginBottom: 44,
              animation: loaded ? "fadeIn 1s ease 0.4s both" : "none",
            }}
          >
            <span className="chapter">Spring — Summer 2025</span>
          </div>

          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(80px, 17vw, 210px)",
              lineHeight: 0.86,
              letterSpacing: "-2px",
              animation: loaded ? "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.15s both" : "none",
            }}
          >
            <div style={{ animation: "glitch 9s ease-in-out infinite" }}>JUST</div>
            <div style={{
              WebkitTextStroke: "1.5px rgba(255,255,255,0.38)",
              color: "transparent",
              animation: "glitch 9s ease-in-out 4.5s infinite",
            }}>DO</div>
            <div>IT.</div>
          </div>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 300,
              color: "rgba(255,255,255,0.42)",
              letterSpacing: "5px", textTransform: "uppercase",
              marginTop: 40,
              animation: loaded ? "fadeUp 1s ease 0.55s both" : "none",
            }}
          >
            Move. Create. Dominate.
          </p>

          <div style={{ marginTop: 60, animation: loaded ? "fadeUp 1s ease 0.75s both" : "none" }}>
            <a href="./nike" style={{ textDecoration: "none" }}>
              <button className="btn-cta">
                <span className="label">Go to Homepage</span>
                <span className="arrow">→</span>
              </button>
            </a>
          </div>
        </div>

        {/* Bottom swoosh */}
        <div style={{
          position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)",
          animation: loaded ? "fadeIn 1.8s ease 1s both" : "none",
          zIndex: 2,
        }}>
          <Swoosh size={52} color="rgba(255,255,255,0.35)" />
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", right: 40, bottom: 44, zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          animation: loaded ? "fadeIn 2s ease 1.2s both" : "none",
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 8,
            letterSpacing: 5, writingMode: "vertical-rl",
            color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
          }}>Scroll</span>
          <div style={{ width: 1, height: 52, background: "rgba(255,255,255,0.12)", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "45%",
              background: "rgba(255,255,255,0.5)", animation: "scanDown 2s ease-in-out infinite",
            }} />
          </div>
        </div>

        {/* Index */}
        <div style={{
          position: "absolute", left: 40, bottom: 44, zIndex: 2,
          fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: 4,
          color: "rgba(255,255,255,0.2)", textTransform: "uppercase",
          animation: loaded ? "fadeIn 2s ease 1s both" : "none",
        }}>
          NK — 2025
        </div>
      </section>

      {/* ══════════════════════════════════ TICKER ══ */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "15px 0", overflow: "hidden",
        background: "rgba(255,255,255,0.012)",
      }}>
        <div style={{ display: "flex", width: "max-content", animation: "ticker 32s linear infinite" }}>
          {[...Array(2)].map((_, r) =>
            ["JUST DO IT", "·", "AIR MAX", "·", "PEGASUS", "·", "AIR FORCE 1", "·", "JORDAN", "·", "DUNK LOW", "·", "REACT", "·", "ZOOM", "·", "FLYKNIT", "·"].map((t, i) => (
              <span key={`${r}-${i}`} style={{
                fontFamily: t === "·" ? "Georgia, serif" : "'Bebas Neue', sans-serif",
                fontSize: t === "·" ? 14 : 12,
                letterSpacing: t === "·" ? 0 : 6,
                color: i % 8 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.14)",
                padding: "0 30px",
              }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════ STATEMENT ══ */}
      <section style={{ padding: "150px 10vw", position: "relative", overflow: "hidden" }}>
        {/* Ghost swoosh BG */}
        <div style={{
          position: "absolute", right: "-8%", top: "50%", transform: "translateY(-50%)",
          animation: "breathe 7s ease-in-out infinite", pointerEvents: "none",
        }}>
          <Swoosh size={680} color="rgba(255,255,255,0.055)" />
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 860 }}>
          <div className="reveal"><span className="chapter">Our Purpose</span></div>
          <h2 className="reveal reveal-d1" style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(52px, 9.5vw, 118px)",
            lineHeight: 0.9, letterSpacing: "-1.5px", marginTop: 36,
          }}>
            IF YOU HAVE
            <br />
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.28)", color: "transparent" }}>A BODY,</span>
            <br />
            YOU ARE AN
            <br />
            ATHLETE.
          </h2>
          <p className="reveal reveal-d2" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16, fontWeight: 300,
            color: "rgba(255,255,255,0.4)", marginTop: 52,
            maxWidth: 460, lineHeight: 1.85, letterSpacing: 0.4,
          }}>
            Nike exists to bring inspiration and innovation to every athlete in the world — pushing the outer boundaries of human potential.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════ IMAGE GRID ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "58vh 42vh" }}>
        {/* Large left */}
        <div style={{ gridRow: "1 / 3", position: "relative", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85&auto=format"
            alt="Nike shoe close-up"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "brightness(0.55) contrast(1.05) saturate(0.7)",
              transform: `scale(1.07) translateY(${(scrollY - 900) * 0.02}px)`,
              transition: "transform 0.05s linear",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 55%, rgba(0,0,0,0.9) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%)" }} />
          <div style={{ position: "absolute", bottom: 44, left: 40 }}>
            <Swoosh size={44} color="rgba(255,255,255,0.65)" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 5, color: "rgba(255,255,255,0.35)", marginTop: 14, textTransform: "uppercase" }}>Footwear</p>
          </div>
        </div>

        {/* Top right */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format"
            alt="Nike apparel"
            loading="lazy"
            decoding="async"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "brightness(0.4) saturate(0.6)",
              transform: `scale(1.06) translateY(${(scrollY - 900) * 0.015}px)`,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
          <div style={{ position: "absolute", top: 28, right: 28 }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 9,
              letterSpacing: 5, color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.12)", padding: "6px 14px",
              textTransform: "uppercase",
            }}>Apparel</span>
          </div>
        </div>

        {/* Bottom right */}
        <div style={{ position: "relative", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format"
            alt="Nike running"
            loading="lazy"
            decoding="async"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "brightness(0.38) saturate(0.65)",
              transform: `scale(1.06) translateY(${(scrollY - 900) * 0.01}px)`,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
          <div style={{ position: "absolute", bottom: 28, left: 32 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: 5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Performance</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════ CINEMATIC IMAGE ══ */}
      <section style={{ position: "relative", height: "82vh", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80&auto=format"
          alt="Nike Shoe"
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            filter: "brightness(0.2) contrast(1.18) saturate(0.45)",
            transform: `scale(1.06) translateY(${(scrollY - 1600) * 0.04}px)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #000 0%, transparent 18%, transparent 82%, #000 100%)" }} />

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 28,
        }}>
          <div className="reveal" style={{ animation: "floatUp 5s ease-in-out infinite" }}>
            <Swoosh size={88} color="rgba(255,255,255,0.88)" />
          </div>

          <h2 className="reveal reveal-d1" style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(50px, 10.5vw, 136px)",
            lineHeight: 0.88, letterSpacing: "-1px", textAlign: "center",
          }}>
            MAKE EVERY
            <br />
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.32)", color: "transparent" }}>STEP COUNT</span>
          </h2>

          <div className="reveal reveal-d2" style={{ display: "flex", gap: 56, marginTop: 32 }}>
            {["Run", "Train", "Compete"].map((label) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.14)", margin: "0 auto 16px" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: 5, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ MANIFESTO ══ */}
      <section style={{
        padding: "160px 10vw",
        background: "#fff", color: "#000",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ghost swoosh on white */}
        <div style={{ position: "absolute", right: "-6%", bottom: "-5%", opacity: 0.05, pointerEvents: "none" }}>
          <Swoosh size={580} color="#000" />
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="reveal">
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 5,
              color: "rgba(0,0,0,0.32)", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{ display: "block", width: 36, height: 1, background: "rgba(0,0,0,0.2)" }} />
              Nike Manifesto
            </span>
          </div>

          <h2 className="reveal reveal-d1" style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(50px, 8.5vw, 106px)",
            lineHeight: 0.9, letterSpacing: "-1.5px", color: "#000", marginTop: 44,
          }}>
            WINNING ISN'T
            <br />
            <span style={{ WebkitTextStroke: "1.5px rgba(0,0,0,0.22)", color: "transparent" }}>COMFORTABLE.</span>
            <br />
            DO IT ANYWAY.
          </h2>

          <div className="reveal reveal-d2" style={{
            marginTop: 72, display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: "44px 88px", maxWidth: 720,
          }}>
            {[
              ["Fuel", "Every victory starts with a single decision to move."],
              ["Focus", "Eliminate the noise. Train your mind as hard as your body."],
              ["Fearless", "Champions don't wait for perfect conditions."],
              ["Forever", "The work never stops. Neither do we."],
            ].map(([title, text]) => (
              <div key={title}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 4, color: "#000", marginBottom: 12 }}>{title}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: "rgba(0,0,0,0.45)", lineHeight: 1.8 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ FULL BLEED IMAGE ══ */}
      <section style={{ position: "relative", height: "62vh", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1504488865935-ae009d05d79f?w=1600&q=80&auto=format"
          alt="Nike athlete"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: "brightness(0.3) saturate(0.55) contrast(1.1)",
            transform: `scale(1.1) translateY(${(scrollY - 3000) * 0.04}px)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #000 0%, transparent 22%, transparent 78%, #000 100%)" }} />
        <div style={{ position: "absolute", inset: 0, padding: "0 10vw", display: "flex", alignItems: "center" }}>
          <div>
            <div className="reveal" style={{ marginBottom: 24 }}>
              <Swoosh size={42} color="rgba(255,255,255,0.58)" />
            </div>
            <div className="reveal reveal-d1" style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(44px, 7.5vw, 90px)",
              lineHeight: 0.88, letterSpacing: "-0.5px",
            }}>
              BORN TO
              <br />
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)", color: "transparent" }}>MOVE.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ CTA ══ */}
      <section style={{
        padding: "170px 10vw 150px",
        textAlign: "center",
        position: "relative", overflow: "hidden", background: "#000",
      }}>
        {/* Rotating rings */}
        {[["62vw", "62vw", 700, "rotateSlow 45s linear infinite", 0.035],
        ["44vw", "44vw", 510, "rotateSlow2 28s linear infinite", 0.055]].map(([w, h, max, anim, op], i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: w, height: h, maxWidth: max, maxHeight: max,
            borderRadius: "50%",
            border: `1px solid rgba(255,255,255,${op})`,
            animation: anim, pointerEvents: "none",
            transform: "translate(-50%,-50%)",
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 52 }}>
            <div style={{ animation: "floatUp 5s ease-in-out infinite" }}>
              <Swoosh size={108} color="rgba(255,255,255,0.82)" />
            </div>
          </div>

          <h2 className="reveal reveal-d1" style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(64px, 13vw, 168px)",
            lineHeight: 0.86, letterSpacing: "-2px", marginBottom: 36,
          }}>
            START
            <br />
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.28)", color: "transparent" }}>YOUR MOVE</span>
          </h2>

          <p className="reveal reveal-d2" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, fontWeight: 300,
            color: "rgba(255,255,255,0.35)", letterSpacing: "5px",
            textTransform: "uppercase", marginBottom: 68,
          }}>
            Experience the full Nike universe
          </p>

          <div className="reveal reveal-d3">
            <a href="./nike" style={{ textDecoration: "none" }}>
              <button className="btn-cta">
                <span className="label">Go to Homepage</span>
                <span className="arrow">→</span>
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ FOOTER STRIP ══ */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "32px 10vw",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#000",
      }}>
        <Swoosh size={44} color="rgba(255,255,255,0.25)" />
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Privacy", "Terms", "© 2025 Nike, Inc."].map((t) => (
            <span key={t} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, letterSpacing: 3,
              color: "rgba(255,255,255,0.18)", textTransform: "uppercase",
            }}>{t}</span>
          ))}
        </div>
      </footer>
    </>
  );
}