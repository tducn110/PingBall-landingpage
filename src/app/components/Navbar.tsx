import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { GOOGLE_FORM_URL } from "../constants";
import vnukLogo from "../../imports/VNUK + ĐHĐN COLOR.png";

const NAV_LINKS = [
  { label: "Thông tin", href: "#info" },
  { label: "Thể lệ", href: "#format" },
  { label: "Bảng XH", href: "#standings" },
  { label: "Đăng ký", href: "#register" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ "--bg-opacity": bgOpacity } as React.CSSProperties}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
        style={{ opacity: bgOpacity }}
      />

      <div className="relative max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex-shrink-0">
          <img
            src={vnukLogo}
            alt="VNUK Đại Học Đà Nẵng"
            className="h-8 w-auto"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                scrolled
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all hover:-translate-y-0.5"
          >
            Đăng ký ngay
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled
              ? "text-slate-700 hover:bg-slate-100"
              : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden backdrop-blur-md border-b px-4 pb-4 ${
            scrolled
              ? "bg-white/98 border-slate-200"
              : "bg-slate-950/98 border-slate-800/60"
          }`}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 border-b text-sm font-medium ${
                scrolled
                  ? "text-slate-600 hover:text-slate-900 border-slate-100"
                  : "text-slate-300 hover:text-white border-slate-800/50"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="block mt-3 bg-orange-500 text-white px-5 py-3 rounded-lg font-bold text-sm text-center"
          >
            Đăng ký ngay
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}