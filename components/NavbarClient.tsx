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
  isAdmin?: boolean;
};

export function NavbarClient({
  displayName,
  email,
  isAdmin = false,
}: NavbarClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visibleLinks = isAdmin ? [...links, { href: "/admin", label: "Admin" }] : links;

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
            {visibleLinks.map((link) => (
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

          {!displayName && (
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
          <Link
            href="/profile"
            className="account-banner-name"
          >
            {displayName}
          </Link>

          <span className="account-dot">•</span>

          <span className="account-banner-email">
            {email}
          </span>

          <form action="/logout" method="POST" className="logout-form">
            <button type="submit" className="logout-btn">
              Logout
            </button>
          </form>
        </div>
      )}

    </header>
  );
}