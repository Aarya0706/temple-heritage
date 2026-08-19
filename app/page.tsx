import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Map, MessageCircle, Sparkles, Bot, ClipboardList } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { TempleCard } from "@/components/TempleCard";
import { temples } from "@/data/temples";
import { festivals } from "@/data/festivals";

const stateCount = new Set(temples.map((t) => t.state)).size;
const deityCount = new Set(temples.map((t) => t.deity)).size;
const festivalCount = festivals.length;

const services = [
  { icon: <Clock3 />, title: "Darshan Timings", text: "Explore temple opening hours, darshan windows and visitor guidance.", href: "/temples" },
  { icon: <CalendarDays />, title: "Festival Calendar", text: "Keep track of major festivals, celebrations and pilgrimage seasons.", href: "/festivals", featured: true },
  { icon: <Map />, title: "AI Yatra Planner", text: "Build a personalized day-by-day pilgrimage itinerary.", href: "/planner" },
  { icon: <Bot />, title: "Temple Recommender", text: "Find temples based on your interests, deity and travel style.", href: "/recommender" },
  { icon: <MessageCircle />, title: "Temple AI Assistant", text: "Ask questions about temples, travel and pilgrimage planning.", href: "/assistant" },
  { icon: <ClipboardList />, title: "Visitor Information", text: "Discover travel tips, local highlights and practical information.", href: "/temples" }
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">✦ India&apos;s sacred heritage portal</div>
          <h1>Discover <span>India&apos;s Sacred Heritage</span></h1>
          <p>
            Explore India&apos;s most revered temples with organized history,
            darshan timings, festivals and AI-powered pilgrimage planning.
          </p>
          <ul className="hero-list">
            <li><span className="check">✓</span> Authentic temple discovery</li>
            <li><span className="check">✓</span> AI-powered itinerary planner</li>
            <li><span className="check">✓</span> Personalized recommendations</li>
            <li><span className="check">✓</span> Festival and darshan information</li>
          </ul>
          <div className="hero-actions">
            <Link className="btn-primary" href="/temples">Explore Temples <ArrowRight size={17} /></Link>
            <Link className="btn-secondary" href="/planner">Plan My Yatra <Sparkles size={17} /></Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-card image-main">
            <img src="https://images.unsplash.com/photo-1600100397608-f0106d6c2a52?auto=format&fit=crop&w=1200&q=85" alt="Indian temple architecture" />
          </div>
          <div className="image-card image-small">
            <img src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1000&q=85" alt="Temple by the Ganga" />
          </div>
          <div className="floating-symbol">🪷</div>
          <div className="image-badge"><small>AI POWERED</small><strong>🤖 Smart Yatra Planner</strong></div>
        </div>
      </section>

      <section className="stats">
        <div className="stat"><strong>{temples.length}</strong><span>Sacred Temples</span></div>
        <div className="stat"><strong>{stateCount}</strong><span>States Covered</span></div>
        <div className="stat"><strong>{deityCount}</strong><span>Deities Featured</span></div>
        <div className="stat"><strong>{festivalCount}</strong><span>Festivals Listed</span></div>
      </section>

      <section className="section section-light">
        <div className="why-grid">
          <div className="collage">
            <img className="big" src="https://images.unsplash.com/photo-1600100397608-f0106d6c2a52?auto=format&fit=crop&w=1100&q=85" alt="Temple heritage" />
            <img className="small" src="https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=900&q=85" alt="Indian pilgrimage site" />
            <div className="collage-badge">🛕</div>
          </div>
          <div className="why-copy">
            <div className="eyebrow">✦ Why choose us</div>
            <h2>One place to explore India&apos;s sacred traditions</h2>
            <p>
              Temple Heritage brings discovery, history and smart travel planning
              together so pilgrims, students, researchers and curious travellers
              can explore India&apos;s spiritual landscape more easily.
            </p>
            <ul className="feature-list">
              <li><span className="tick">✓</span> Organized temple information</li>
              <li><span className="tick">✓</span> AI-powered pilgrimage planning</li>
              <li><span className="tick">✓</span> Personalized recommendations</li>
              <li><span className="tick">✓</span> Festival and seasonal guidance</li>
              <li><span className="tick">✓</span> Practical travel insights</li>
            </ul>
            <Link href="/about" className="btn-primary" style={{ background: "#a62e15", color: "white" }}>Learn More →</Link>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <SectionHeading
          dark
          title="How We Can Help"
          description="From finding the right temple to planning your complete pilgrimage, everything starts here."
        />
        <div className="services">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className={`service-card ${service.featured ? "featured" : ""}`}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="service-link">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-light">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured Temples"
          description="A starting collection of some of India's most remarkable pilgrimage destinations."
        />
        <div className="temple-grid">
          {temples.slice(0, 6).map((temple) => <TempleCard key={temple.slug} temple={temple} />)}
        </div>
      </section>

      <section className="cta">
        <div className="eyebrow" style={{ color: "#ffd080" }}>✦ Our mission</div>
        <h2>Preserving India&apos;s Sacred Legacy</h2>
        <p>
          Make India&apos;s rich temple heritage easier to discover while helping
          travellers turn curiosity into meaningful journeys.
        </p>
        <div className="cta-actions">
          <Link href="/temples" className="btn-primary">Start Exploring</Link>
          <Link href="/planner" className="btn-secondary">Plan a Yatra</Link>
        </div>
      </section>
    </main>
  );
}
