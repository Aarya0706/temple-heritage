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

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <div className="brand-mark">🛕</div>
        <div>
          <div className="brand-title">Temple Heritage</div>
          <div className="brand-subtitle">INDIA'S SACRED PORTALS</div>
        </div>
      </Link>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        <div className="nav-links-inner">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/temples" className="explore-btn">
          <Sparkles size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
          Explore
        </Link>
        <button className="menu-btn" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
