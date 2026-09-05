import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Map,
  MessageCircle,
  Sparkles,
  Bot,
  MoonStar,
  Stamp,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { TempleCard } from "@/components/TempleCard";
import { temples } from "@/data/temples";
import { festivals } from "@/data/festivals";

const stateCount = new Set(temples.map((t) => t.state)).size;
const deityCount = new Set(temples.map((t) => t.deity)).size;
const festivalCount = festivals.length;

// Reliable Wikimedia Commons images of actual Hindu temples.
// These are intentionally not tourism/transport/landscape photos.
const MEENAKSHI =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Madurai%20meenakshi%20temple.jpg?width=1200";

const KEDARNATH = "/images/kedarnath.jpg";

const services = [
  {
    icon: <Compass />,
    title: "AI Yatra Planner",
    text: "Build a personalized day-by-day pilgrimage itinerary.",
    href: "/planner",
    featured: true,
    accent: "saffron",
  },
  {
    icon: <MessageCircle />,
    title: "Temple AI Assistant",
    text: "Ask questions about temples, travel and pilgrimage planning.",
    href: "/assistant",
    accent: "teal",
  },
  {
    icon: <Map />,
    title: "Interactive Temple Map",
    text: "Explore all 12 temples clustered by state, filterable by deity and festival.",
    href: "/temples",
    accent: "indigo",
  },
  {
    icon: <MoonStar />,
    title: "Horoscope Finder",
    text: "Find temples matched to your sun sign and ruling planet.",
    href: "/horoscope",
    accent: "violet",
  },
  {
    icon: <Stamp />,
    title: "Pilgrimage Passport",
    text: "Track the sacred sites you've visited and watch your stamps add up.",
    href: "/profile/passport",
    accent: "emerald",
  },
  {
    icon: <Bot />,
    title: "Temple Recommender",
    text: "Find temples based on your interests, deity and travel style.",
    href: "/recommender",
    accent: "rose",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <video
          className="hero-bell"
          src="/videos/temple-bell.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="hero-copy">
          <div className="kicker">✦ India&apos;s sacred heritage portal</div>

          <h1>
            Discover <span>India&apos;s Sacred Heritage</span>
          </h1>

          <p>
            Explore India&apos;s most revered temples with organized history,
            darshan timings, festivals and AI-powered pilgrimage planning.
          </p>

          <ul className="hero-list">
            <li>
              <span className="check">✓</span> Authentic temple discovery
            </li>
            <li>
              <span className="check">✓</span> AI-powered itinerary planner
            </li>
            <li>
              <span className="check">✓</span> Personalized recommendations
            </li>
            <li>
              <span className="check">✓</span> Festival and darshan information
            </li>
          </ul>

          <div className="hero-actions">
            <Link className="btn-primary" href="/temples">
              Explore Temples <ArrowRight size={17} />
            </Link>

            <Link className="btn-secondary" href="/planner">
              Plan My Yatra <Sparkles size={17} />
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-card image-main">
            <img src={MEENAKSHI} alt="Meenakshi Amman Temple in Madurai" />
          </div>

          <div className="image-card image-small">
            <img src={KEDARNATH} alt="Kedarnath Temple in Uttarakhand" />
          </div>

          <div className="floating-symbol">🪷</div>
          
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <strong>{temples.length}</strong>
          <span>Sacred Temples</span>
        </div>
        <div className="stat">
          <strong>{stateCount}</strong>
          <span>States Covered</span>
        </div>
        <div className="stat">
          <strong>{deityCount}</strong>
          <span>Deities Featured</span>
        </div>
        <div className="stat">
          <strong>{festivalCount}</strong>
          <span>Festivals Listed</span>
        </div>
      </section>

      <section className="section section-light">
        <div className="why-grid">
          <div className="collage">

            <img
              className="big"
              src="/images/somnath.png"
              alt="Somnath Temple in Gujarat"
            />

            <img
              className="small"
              src="/images/brihadeeswarar.jpg"
              alt="Brihadeeswarar Temple in Thanjavur"
            />

            <div className="collage-badge">🛕</div>

          </div>

          <div className="why-copy">
            <div className="eyebrow">✦ Why choose us</div>

            <h2>
              One place to explore India&apos;s sacred traditions
            </h2>

            <p>
              Temple Heritage brings discovery, history and smart travel
              planning together so pilgrims, students, researchers and curious
              travellers can explore India&apos;s spiritual landscape more
              easily.
            </p>

            <ul className="feature-list">
              <li>
                <span className="tick">✓</span> Organized, verified temple
                information
              </li>
              <li>
                <span className="tick">✓</span> AI-powered pilgrimage planning
              </li>
              <li>
                <span className="tick">✓</span> Personalized recommendations
              </li>
              <li>
                <span className="tick">✓</span> Festival and darshan-season
                guidance
              </li>
              <li>
                <span className="tick">✓</span> Practical visitor and travel
                insights
              </li>
              <li>
                <span className="tick">✓</span> Coverage across {stateCount}+
                Indian states
              </li>
            </ul>

            <Link
              href="/about"
              className="btn-primary"
              style={{ background: "#a62e15", color: "white" }}
            >
              Learn More →
            </Link>
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
            <Link
              key={service.title}
              href={service.href}
              className={`service-card ${
                service.featured ? "featured" : ""
              }`}
            >
              <div className={`service-icon accent-${service.accent}`}>
                {service.icon}
              </div>
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
          {temples.slice(0, 6).map((temple) => (
            <TempleCard key={temple.slug} temple={temple} />
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="eyebrow" style={{ color: "#ffd080" }}>
          ✦ Our mission
        </div>

        <h2>Preserving India&apos;s Sacred Legacy</h2>

        <p>
          Make India&apos;s rich temple heritage easier to discover while
          helping travellers turn curiosity into meaningful journeys.
        </p>

        <div className="cta-actions">
          <Link href="/temples" className="btn-primary">
            Start Exploring
          </Link>
          <Link href="/planner" className="btn-secondary">
            Plan a Yatra
          </Link>
        </div>
      </section>
    </main>
  );
}