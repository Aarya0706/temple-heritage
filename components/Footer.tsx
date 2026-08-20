import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>🛕 Temple Heritage</h3>
          <p>
            A modern digital gateway for exploring India&apos;s sacred temple
            heritage — preserving history and helping travellers plan meaningful journeys.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/temples">Browse Temples</Link>
            <Link href="/festivals">Festivals</Link>
            <Link href="/planner">AI Planner</Link>
            <Link href="/recommender">Recommender</Link>
          </div>
        </div>
        <div>
          <h3>About</h3>
          <p>
            Built to support pilgrims, tourists and researchers with
            organized temple information, discovery tools and smart planning.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Temple Heritage</span>
        <span>Built with curiosity, code & 🪷</span>
      </div>
    </footer>
  );
}
