"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/temples", label: "Browse Temples" },
  { href: "/festivals", label: "Festivals" },
  { href: "/darshan", label: "Darshan" },
  { href: "/planner", label: "AI Planner" },
  { href: "/recommender", label: "Recommender" },
  { href: "/my-yatras", label: "My Yatras" },
];

type NavbarClientProps = {
  displayName: string | null;
  email: string | null;
};

export function NavbarClient({
  displayName,
  email,
}: NavbarClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">

      {/* TOP NAVIGATION */}
      <div className="navbar-inner">

        {/* LOGO */}
        <Link
          href="/"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <div className="brand-mark">🛕</div>

          <div className="brand-text">
            <div className="brand-title">
              Temple Heritage
            </div>

            <div className="brand-subtitle">
              INDIA&apos;S SACRED PORTALS
            </div>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <div className="nav-links-inner">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${
                  pathname === link.href ? "active" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ACTIONS */}
        <div className="navbar-actions">

          <Link
            href="/temples"
            className="explore-btn"
          >
            <Sparkles size={18} />
            <span>Explore</span>
          </Link>

          {displayName ? (
            <Link
              href="/profile"
              className="user-chip"
              title={displayName}
            >
              {displayName}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="explore-btn"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            className="menu-btn"
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* EMAIL STRIP */}
      {email && (
        <div className="account-banner">
          <span className="account-banner-name">
            {displayName}
          </span>

          <span className="account-dot">•</span>

          <span className="account-banner-email">
            {email}
          </span>
        </div>
      )}

    </header>
  );
}