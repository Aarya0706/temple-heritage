"use client";

import Link from "next/link";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/temples", label: "Browse Temples" },
  { href: "/discover", label: "Discover" },
  { href: "/festivals", label: "Festivals" },
];

// Grouped under a single "Services" dropdown — the practical,
// logged-in-adjacent tools (planning, saved trips) as opposed to the
// browsing pages above. "Discover" used to live here as "Recommender" —
// it moved to a top-level tab since it's meant to be a page people land
// on repeatedly, not a one-off tool buried in a dropdown.
const serviceLinks = [
  { href: "/planner", label: "AI Planner", blurb: "Build a pilgrimage itinerary" },
  { href: "/horoscope", label: "Horoscope Finder", blurb: "Find temples by your sun sign" },
  { href: "/darshan", label: "Darshan", blurb: "Check timings and crowd info" },
  { href: "/my-yatras", label: "My Yatras", blurb: "Saved temples and trip plans" },
  { href: "/profile/passport", label: "Pilgrimage Passport", blurb: "Track temples you've visited" },
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
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const isServiceActive = serviceLinks.some((link) => link.href === pathname);

  // Close the dropdown on outside click (desktop hover/click) — doesn't
  // interfere with the mobile accordion, which only opens via its own
  // toggle button and closes on link click / menu close below.
  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [servicesOpen]);

  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="navbar">

      {/* TOP NAVIGATION */}
      <div className="navbar-inner">

        {/* LOGO */}
        <Link
          href="/"
          className="brand"
          onClick={closeAll}
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
                onClick={closeAll}
              >
                {link.label}
              </Link>
            ))}

            <div className="nav-dropdown" ref={servicesRef}>
              <button
                type="button"
                className={`nav-link nav-dropdown-toggle ${
                  isServiceActive || servicesOpen ? "active" : ""
                }`}
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
              >
                Services
                <ChevronDown
                  size={15}
                  style={{
                    marginLeft: 5,
                    transition: "transform 0.2s ease",
                    transform: servicesOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </button>

              <div className={`nav-dropdown-panel ${servicesOpen ? "open" : ""}`}>
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-dropdown-link ${
                      pathname === link.href ? "active" : ""
                    }`}
                    onClick={closeAll}
                  >
                    <span className="nav-dropdown-link-label">{link.label}</span>
                    <span className="nav-dropdown-link-blurb">{link.blurb}</span>
                  </Link>
                ))}
              </div>
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
                onClick={closeAll}
              >
                Admin
              </Link>
            )}

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

          {/* Compact login/signup shown only at <=1000px, next to the
              hamburger button, so logged-out visitors on phone see auth
              instantly instead of having to open the menu. The full-size
              .login-btn/.explore-btn versions above cover desktop and are
              hidden by CSS at this breakpoint. */}
          {!displayName && (
            <div className="mobile-auth-links">
              <Link href="/login" className="mobile-login-btn">
                Login
              </Link>

              <Link href="/signup" className="mobile-signup-btn">
                Sign up
              </Link>
            </div>
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
