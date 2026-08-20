"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

const interests = ["Temples", "Architecture", "Food", "Nature", "History", "Festivals"];

type ItineraryDay = {
  day: string;
  title: string;
  description: string;
  templeSlugs: string[];
};

export default function PlannerPage() {
  const [days, setDays] = useState("5");
  const [from, setFrom] = useState("Mumbai");
  const [region, setRegion] = useState("South India");
  const [selected, setSelected] = useState(["Temples", "Architecture"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [summary, setSummary] = useState("");

  function toggleInterest(item: string) {
    setSelected((current) => (current.includes(item) ? current.filter((x) => x !== item) : [...current, item]));
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, days: Number(days), region, interests: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong generating your itinerary.");
      }
      setItinerary(data.days);
      setSummary(data.summary || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ AI-powered planning</div>
        <h1>Plan Your Yatra</h1>
        <p>Tell us what kind of journey you want, and our AI will build a real, personalized itinerary from our temple database.</p>
      </section>

      <section className="section section-light">
        <div className="planner-grid">
          <div className="panel">
            <h3>Your preferences</h3>
            <div className="form-group">
              <label>Starting city</label>
              <input value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="form-group">
              <label>How many days?</label>
              <select value={days} onChange={(e) => setDays(e.target.value)}>
                {[2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Preferred region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option>North India</option>
                <option>South India</option>
                <option>East India</option>
                <option>West India</option>
                <option>Central India</option>
              </select>
            </div>
            <div className="form-group">
              <label>Interests</label>
              <div className="chips">
                {interests.map((item) => (
                  <button key={item} className={`chip ${selected.includes(item) ? "selected" : ""}`} onClick={() => toggleInterest(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ background: "#a52d15", color: "white", width: "100%", border: 0, opacity: loading ? 0.7 : 1 }}
              onClick={generate}
              disabled={loading}
            >
              {loading ? <Loader2 size={17} className="spin" /> : <Sparkles size={17} />}
              {loading ? "Planning your yatra..." : "Generate My Yatra"}
            </button>
            {error && <p style={{ color: "#b3261e", marginTop: 10, fontSize: 14 }}>{error}</p>}
          </div>

          <div className="panel">
            <h3>{itinerary ? `Your ${itinerary.length}-day ${region} Yatra` : "Your itinerary will appear here"}</h3>
            {!itinerary && !loading ? (
              <div className="empty">
                <div style={{ fontSize: 45, marginBottom: 15 }}>🪷</div>
                <p>
                  Starting from <strong>{from}</strong>, choose your preferences and generate a journey.
                </p>
              </div>
            ) : loading ? (
              <div className="empty">
                <Loader2 size={32} className="spin" style={{ marginBottom: 15 }} />
                <p>Our AI is building your itinerary from real temples in our database...</p>
              </div>
            ) : (
              <div className="itinerary">
                {summary && <p style={{ marginBottom: 10, color: "#6b4a3d" }}>{summary}</p>}
                {itinerary!.map((d) => (
                  <div className="day-card" key={d.day}>
                    <strong>
                      {d.day} · {d.title}
                    </strong>
                    <p>{d.description}</p>
                    <small style={{ color: "#9d3b1b" }}>Interests: {selected.join(", ") || "General heritage"}</small>
                  </div>
                ))}
                <button className="btn-secondary" style={{ color: "#8d2416", borderColor: "#b85c42", width: "fit-content" }}>
                  Save itinerary <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
