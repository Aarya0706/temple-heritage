 "use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const interests = ["Temples", "Architecture", "Food", "Nature", "History", "Festivals"];

const sampleDays = [
  ["Day 1", "Arrival + local heritage", "Explore the old city, visit a nearby temple and finish with a traditional evening experience."],
  ["Day 2", "Main pilgrimage day", "Start early for darshan, explore the temple complex and keep the afternoon for local heritage."],
  ["Day 3", "Culture + nearby shrine", "Visit another sacred destination, try local food and spend the evening at a cultural landmark."],
  ["Day 4", "Slow travel", "Keep the morning relaxed, explore a market or museum and visit one final temple."],
  ["Day 5", "Departure", "Morning darshan or peaceful walk, then depart with time for local shopping and food."]
];

export default function PlannerPage() {
  const [days, setDays] = useState("5");
  const [from, setFrom] = useState("Mumbai");
  const [region, setRegion] = useState("South India");
  const [selected, setSelected] = useState(["Temples", "Architecture"]);
  const [generated, setGenerated] = useState(false);

  const itinerary = useMemo(() => sampleDays.slice(0, Math.max(1, Math.min(5, Number(days) || 5))), [days]);

  function toggleInterest(item: string) {
    setSelected((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item]);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ AI-powered planning</div>
        <h1>Plan Your Yatra</h1>
        <p>Tell us what kind of journey you want. This demo generates a personalized itinerary instantly — the real AI layer can be connected next.</p>
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
                {[2,3,4,5].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Preferred region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option>North India</option><option>South India</option><option>East India</option><option>West India</option><option>Central India</option>
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
            <button className="btn-primary" style={{ background: "#a52d15", color: "white", width: "100%", border: 0 }} onClick={() => setGenerated(true)}>
              <Sparkles size={17} /> Generate My Yatra
            </button>
          </div>

          <div className="panel">
            <h3>{generated ? `Your ${days}-day ${region} Yatra` : "Your itinerary will appear here"}</h3>
            {!generated ? (
              <div className="empty">
                <div style={{ fontSize: 45, marginBottom: 15 }}>🪷</div>
                <p>Starting from <strong>{from}</strong>, choose your preferences and generate a journey.</p>
              </div>
            ) : (
              <div className="itinerary">
                {itinerary.map(([day, title, description]) => (
                  <div className="day-card" key={day}>
                    <strong>{day} · {title}</strong>
                    <p>{description}</p>
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
