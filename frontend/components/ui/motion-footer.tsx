"use client";

import * as React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;700;900&display=swap');

.nk-footer {
  font-family: 'Barlow', sans-serif;
  background: #0a0a0a;
  color: #fff;
  position: relative;
  overflow: hidden;
  width: 100%;
  -webkit-font-smoothing: antialiased;
}

/* ── Noise texture overlay ── */
.nk-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}

/* ── Giant Swoosh watermark ── */
.nk-bg-swoosh {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

.nk-bg-swoosh svg {
  width: 110%;
  height: auto;
  opacity: 0.045;
  transform: translateY(10%);
  fill: #ffffff;
}

/* ── Top hairline ── */
.nk-top-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent);
}

/* ── Hero row ── */
.nk-hero {
  position: relative;
  z-index: 2;
  padding: 52px 48px 36px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

@media (max-width: 768px) {
  .nk-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
    padding: 40px 24px 28px;
  }
}

.nk-logo-wordmark {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 96px;
  letter-spacing: -2px;
  line-height: 1;
  color: #fff;
  user-select: none;
}

.nk-tagline {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 5px;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  margin-top: 4px;
  font-weight: 700;
}

/* ── Newsletter ── */
.nk-newsletter {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .nk-newsletter { align-items: flex-start; }
}

.nk-newsletter-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  font-weight: 700;
}

.nk-email-row {
  display: flex;
  border: 1px solid rgba(255,255,255,0.18);
}

.nk-email-input {
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 16px;
  color: #fff;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  width: 220px;
  caret-color: #fff;
}

.nk-email-input::placeholder { color: rgba(255,255,255,0.3); }

.nk-join-btn {
  background: #fff;
  color: #0a0a0a;
  border: none;
  padding: 10px 20px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
}

.nk-join-btn:hover { background: #e0e0e0; }

/* ── Links grid ── */
.nk-links {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

@media (max-width: 768px) {
  .nk-links { grid-template-columns: repeat(2, 1fr); }
}

.nk-col {
  padding: 36px 36px 36px 48px;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.nk-col:last-child { border-right: none; }

@media (max-width: 768px) {
  .nk-col { padding: 28px 16px 28px 24px; }
  .nk-col:nth-child(even) { border-right: none; }
}

.nk-col-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3.5px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  margin-bottom: 18px;
}

.nk-link {
  display: block;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 13px;
  transition: color 0.15s;
  letter-spacing: 0.1px;
}

.nk-link:hover { color: #fff; }

/* ── Bottom bar ── */
.nk-bottom {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 768px) {
  .nk-bottom { padding: 20px 24px; flex-direction: column; align-items: flex-start; }
}

.nk-social {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nk-social a {
  color: rgba(255,255,255,0.35);
  transition: color 0.15s;
  display: flex;
  align-items: center;
}

.nk-social a:hover { color: #fff; }

.nk-legal {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.nk-legal-link {
  color: rgba(255,255,255,0.3);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.3px;
  transition: color 0.15s;
}

.nk-legal-link:hover { color: rgba(255,255,255,0.7); }

.nk-copy {
  font-size: 11px;
  color: rgba(255,255,255,0.2);
  letter-spacing: 0.3px;
}

.nk-divider-dot {
  width: 2px;
  height: 2px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.nk-region {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  transition: color 0.15s;
  letter-spacing: 0.3px;
  background: none;
  border: none;
}

.nk-region:hover { color: rgba(255,255,255,0.7); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function CinematicFooter() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <footer className="nk-footer">
        {/* Grain texture */}
        <div className="nk-noise" />

        {/* Giant Swoosh SVG watermark */}
        <div className="nk-bg-swoosh">
          <svg viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,250 C80,180 200,80 360,50 C480,28 600,60 680,100 C760,140 800,190 860,200 C950,215 1050,170 1200,100 L1200,120 C1050,195 940,245 840,232 C770,222 720,175 640,138 C560,100 440,70 320,95 C180,125 70,220 0,300 Z" />
          </svg>
        </div>

        {/* Top hairline */}
        <div className="nk-top-line" />

        {/* ── HERO: Logo + Newsletter ── */}
        <div className="nk-hero">
          <div>
            <div className="nk-logo-wordmark">NIKE</div>
            <div className="nk-tagline">Just Do It</div>
          </div>

          <div className="nk-newsletter">
            <div className="nk-newsletter-label">Stay in the Game</div>
            <div className="nk-email-row">
              <input
                className="nk-email-input"
                type="email"
                placeholder="Your email address"
                aria-label="Email address for newsletter"
              />
              <button className="nk-join-btn">Join</button>
            </div>
          </div>
        </div>

        {/* ── LINKS GRID ── */}
        <div className="nk-links">
          {[
            {
              title: "Products",
              links: ["Shoes", "Clothing", "Accessories", "Equipment", "Sale"],
            },
            {
              title: "Sports",
              links: ["Running", "Basketball", "Football", "Training", "Skateboarding"],
            },
            {
              title: "Company",
              links: ["About Nike", "News", "Careers", "Investors", "Sustainability"],
            },
            {
              title: "Support",
              links: ["Get Help", "Order Status", "Size Guide", "Returns", "Contact Us"],
            },
          ].map((col) => (
            <div className="nk-col" key={col.title}>
              <div className="nk-col-title">{col.title}</div>
              {col.links.map((link) => (
                <a href="#" className="nk-link" key={link}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="nk-bottom">
          {/* Social icons */}
          <div className="nk-social">
            {/* X / Twitter */}
            <a href="#" aria-label="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.623 5.905-5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          {/* Legal + copyright */}
          <div className="nk-legal">
            <button className="nk-region" aria-label="Select region">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Nepal
            </button>
            <span className="nk-divider-dot" />
            <a href="#" className="nk-legal-link">Privacy Policy</a>
            <a href="#" className="nk-legal-link">Terms of Use</a>
            <a href="#" className="nk-legal-link">Cookie Settings</a>
            <span className="nk-divider-dot" />
            <span className="nk-copy">© 2026 Nike, Inc.</span>
          </div>
        </div>
      </footer>
    </>
  );
}