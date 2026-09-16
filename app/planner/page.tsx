"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Sparkles, Loader2, X, Check } from "lucide-react";
import { temples } from "@/data/temples";
import { resolveTemples } from "@/lib/yatra-route";
import { DayStopThumbs } from "@/components/DayStopThumbs";

const interests = ["Temples", "Architecture", "Food", "Nature", "History", "Festivals"];
const travelStyles = [
  { value: "Relaxed", blurb: "One temple a day, plenty of rest." },
  { value: "Balanced", blurb: "A comfortable mix of sights and downtime." },
  { value: "Packed", blurb: "See as much as realistically possible." },
] as const;

const STEPS = ["Where & when", "Region & pace", "Interests", "Review"] as const;

// The AI planner is allowed to pull in a temple from an adjacent region when
// it meaningfully improves the trip (see the system prompt in
// app/api/planner/route.ts). That means the user's *requested* region filter
// can no longer be trusted as a label for what the itinerary actually
// contains — e.g. asking for "North India" can still come back with
// Mahakaleshwar in Ujjain, which is Central India. Instead of echoing the
// requested filter, look up every temple actually included via its
// templeSlugs and build the label from the real regions represented.
function actualRegionsLabel(itinerary: ItineraryDay[], requestedRegion: string): string {
  const slugToRegion = new Map(temples.map((t) => [t.slug, t.region]));
  const regionsUsed = new Set<string>();

  for (const day of itinerary) {
    for (const slug of day.templeSlugs || []) {
      const r = slugToRegion.get(slug);
      if (r) regionsUsed.add(r);
    }
  }

  if (regionsUsed.size === 0) {
    // No temple slugs came back (unlikely, but be defensive) — fall back to
    // the requested filter rather than showing an empty label.
    return requestedRegion;
  }

  return Array.from(regionsUsed).sort().join(" & ");
}

type ItineraryDay = {
  day: string;
  title: string;
  description: string;
  templeSlugs: string[];
};

// When arriving from a festival page with a `temples` query param, figure out
// which region those temples are mostly in, so the region dropdown starts on
// something relevant instead of the hardcoded South India default.
function dominantRegion(templeSlugs: string[]): string | null {
  const counts = new Map<string, number>();
  for (const slug of templeSlugs) {
    const temple = temples.find((t) => t.slug === slug);
    if (!temple) continue;
    counts.set(temple.region, (counts.get(temple.region) || 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [region, count] of counts) {
    if (count > bestCount) {
      best = region;
      bestCount = count;
    }
  }
  return best;
}

// Formats an ISO date (e.g. "2026-10-11") as "11 October 2026" for display.
// Falls back to the raw string if it doesn't parse, rather than showing
// nothing or throwing.
function formatFestivalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function WizardSteps({ current }: { current: number }) {
  return (
    <>
      <div className="wizard-steps">
        {STEPS.map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "0 0 auto" }}>
            <div className={`wizard-step-dot ${i === current ? "active" : ""} ${i < current ? "done" : ""}`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`wizard-step-line ${i < current ? "done" : ""}`} />}
          </div>
        ))}
      </div>
      <div className="wizard-step-label">
        Step {current + 1} of {STEPS.length} · {STEPS[current]}
      </div>
    </>
  );
}

function PlannerInner() {
  const searchParams = useSearchParams();
  const festivalParam = searchParams.get("festival");
  const templesParam = searchParams.get("temples");
  const dateParam = searchParams.get("date");

  const [step, setStep] = useState(0);
  const [days, setDays] = useState("5");
  const [from, setFrom] = useState("Mumbai");
  const [travelStyle, setTravelStyle] = useState<(typeof travelStyles)[number]["value"]>("Balanced");
  const [region, setRegion] = useState(() => {
    if (!festivalParam) return "South India";
    const slugs = templesParam ? templesParam.split(",").filter(Boolean) : [];
    return dominantRegion(slugs) || "South India";
  });
  const [selected, setSelected] = useState(() => {
    const base = ["Temples", "Architecture"];
    return festivalParam ? [...base, "Festivals"] : base;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [festival, setFestival] = useState<string | null>(() => festivalParam || null);
  const [festivalDate, setFestivalDate] = useState<string | null>(() => dateParam || null);

  function toggleInterest(item: string) {
    setSelected((current) => (current.includes(item) ? current.filter((x) => x !== item) : [...current, item]));
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setItinerary(null);
    setSaved(false);
    setNeedsLogin(false);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          days: Number(days),
          region,
          interests: selected,
          travelStyle,
          festival,
          festivalDate,
          festivalTemples: festival && templesParam ? templesParam.split(",").filter(Boolean) : [],
        }),
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

  async function saveItinerary() {
    if (!itinerary) return;
    setSaving(true);
    setNeedsLogin(false);
    try {
      const displayRegion = actualRegionsLabel(itinerary, region);
      const res = await fetch("/api/yatra-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${itinerary.length}-day ${displayRegion} Yatra from ${from}`,
          // Keep both: `region` stays the user's requested filter (useful for
          // "plan again" / analytics), `displayRegion` is what should actually
          // be shown to the user since it reflects the real itinerary content.
          itinerary: { days: itinerary, summary, region, displayRegion, from, travelStyle },
        }),
      });
      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
    } catch {
      setError("Couldn't save itinerary. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ AI-powered planning</div>
        <h1>Plan Your Yatra</h1>
        <p>Tell us what kind of journey you want, and our AI will build a real, personalized itinerary from our temple database.</p>
      </section>

      {festival && (
        <section className="section-light" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              background: "#fdf1ea",
              border: "1px solid #e8c4ac",
              borderRadius: 10,
              padding: "12px 18px",
              margin: "0 auto 24px",
              maxWidth: 900,
            }}
          >
            <span style={{ color: "#6b4a3d", fontSize: 14 }}>
              <Sparkles size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Planning around <strong>{festival}</strong>
              {festivalDate ? (
                <>
                  {" "}(<strong>{formatFestivalDate(festivalDate)}</strong>)
                </>
              ) : null}{" "}
              — we&apos;ll build your yatra around this festival and where it&apos;s celebrated.
            </span>
            <button
              onClick={() => {
                setFestival(null);
                setFestivalDate(null);
              }}
              aria-label="Clear festival context"
              style={{ background: "none", border: 0, cursor: "pointer", color: "#6b4a3d", flexShrink: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        </section>
      )}

      <section className="section section-light">
        <div className="planner-grid">
          <div className="panel">
            <h3>Your preferences</h3>
            <WizardSteps current={step} />

            {step === 0 && (
              <>
                <div className="form-group">
                  <label>Starting city</label>
                  <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Mumbai" />
                </div>
                <div className="form-group">
                  <label>How many days?</label>
                  <select value={days} onChange={(e) => setDays(e.target.value)}>
                    {[2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {step === 1 && (
              <>
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
                  <label>Travel style</label>
                  <div className="chips">
                    {travelStyles.map((ts) => (
                      <button
                        key={ts.value}
                        type="button"
                        className={`chip ${travelStyle === ts.value ? "selected" : ""}`}
                        onClick={() => setTravelStyle(ts.value)}
                        title={ts.blurb}
                      >
                        {ts.value}
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: "#a3806f" }}>
                    {travelStyles.find((ts) => ts.value === travelStyle)?.blurb}
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="form-group">
                <label>Interests</label>
                <div className="chips">
                  {interests.map((item) => (
                    <button key={item} type="button" className={`chip ${selected.includes(item) ? "selected" : ""}`} onClick={() => toggleInterest(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ marginBottom: 10 }}>
                <div className="wizard-review-item">
                  <span>Starting from</span>
                  <span>{from || "—"}</span>
                </div>
                <div className="wizard-review-item">
                  <span>Duration</span>
                  <span>{days} days</span>
                </div>
                <div className="wizard-review-item">
                  <span>Region</span>
                  <span>{region}</span>
                </div>
                <div className="wizard-review-item">
                  <span>Travel style</span>
                  <span>{travelStyle}</span>
                </div>
                <div className="wizard-review-item">
                  <span>Interests</span>
                  <span>{selected.join(", ") || "General heritage"}</span>
                </div>
              </div>
            )}

            <div className="wizard-nav">
              {step > 0 && (
                <button type="button" className="btn-secondary" style={{ color: "#8d2416", borderColor: "#b85c42" }} onClick={goBack}>
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: "#a52d15", color: "white", border: 0, flex: 1 }}
                  onClick={goNext}
                  disabled={step === 0 && !from.trim()}
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: "#a52d15", color: "white", border: 0, flex: 1, opacity: loading ? 0.7 : 1 }}
                  onClick={generate}
                  disabled={loading}
                >
                  {loading ? <Loader2 size={17} className="spin" /> : <Sparkles size={17} />}
                  {loading ? "Planning your yatra..." : "Generate My Yatra"}
                </button>
              )}
            </div>
            {error && <p style={{ color: "#b3261e", marginTop: 10, fontSize: 14 }}>{error}</p>}
          </div>

          <div className="panel">
            <h3>{itinerary ? `Your ${itinerary.length}-day ${actualRegionsLabel(itinerary, region)} Yatra` : "Your itinerary will appear here"}</h3>
            {!itinerary && !loading ? (
              <div className="empty-itinerary">
                <img
                  src="/images/temple-pond.png"
                  alt="Temple journey"
                  className="itinerary-image"
                />

                <div className="empty-content">
                  <div className="flower">🌺</div>

                  <p>
                    Starting from <strong>{from}</strong>, choose your preferences and
                    generate a journey.
                  </p>

                  <span>
                    Your personalized spiritual journey is waiting to be discovered.
                  </span>
                </div>
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
                    <DayStopThumbs stops={resolveTemples(d.templeSlugs)} />
                    <small style={{ color: "#9d3b1b", display: "block", marginTop: 8 }}>Interests: {selected.join(", ") || "General heritage"}</small>
                  </div>
                ))}

                {needsLogin ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "#fdf1ea",
                      border: "1px solid #e8c4ac",
                      borderRadius: 10,
                      padding: "12px 16px",
                      width: "fit-content",
                    }}
                  >
                    <span style={{ color: "#6b4a3d", fontSize: 14 }}>
                      Log in to save this itinerary — it&apos;ll stay right here while you do.
                    </span>
                    <a
                      href="/login"
                      className="btn-secondary"
                      style={{ color: "#8d2416", borderColor: "#b85c42", whiteSpace: "nowrap" }}
                    >
                      Log in <ArrowRight size={16} />
                    </a>
                  </div>
                ) : (
                  <button
                    className="btn-secondary"
                    style={{ color: "#8d2416", borderColor: "#b85c42", width: "fit-content", opacity: saving ? 0.7 : 1 }}
                    onClick={saveItinerary}
                    disabled={saving || saved}
                  >
                    {saving ? (
                      <Loader2 size={16} className="spin" />
                    ) : saved ? (
                      "Saved ✓"
                    ) : (
                      <>
                        Save itinerary <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={null}>
      <PlannerInner />
    </Suspense>
  );
}
