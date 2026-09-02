import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#f5be64" }}>✦ Our mission</div>
        <h1>Preserving Sacred Legacy</h1>
        <p>Making India&apos;s temple heritage easier to discover, understand and experience responsibly.</p>
      </section>
      <section className="section section-light">
        <div className="why-grid">
          <div className="collage">
            <img className="big" src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1100&q=85" alt="Indian heritage" />
            <img className="small" src="/images/kashi-vishwanath.png" alt="Kashi Vishwanath Temple architecture" />
          </div>
          <div className="why-copy">
            <div className="eyebrow">✦ Why Temple Heritage</div>
            <h2>Technology should make heritage easier to reach.</h2>
            <p>
              Temple Heritage is designed as a digital heritage and pilgrimage companion.
              The goal is to bring temple discovery, cultural context, travel planning and
              intelligent recommendations into one simple experience.
            </p>
            <p>
              As the project grows, the platform can add verified datasets, user accounts,
              live information, maps, multilingual support and AI-powered planning.
            </p>
            <Link href="/temples" className="btn-primary" style={{ background: "#a11968", color: "white" }}>Explore the collection →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}