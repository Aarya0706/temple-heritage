 "use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { temples } from "@/data/temples";
import Link from "next/link";

const options = ["Lord Shiva", "Lord Vishnu / Krishna", "Goddess", "Architecture", "History", "Nature", "Jyotirlinga"];

export default function RecommenderPage() {
  const [selected, setSelected] = useState<string[]>(["Architecture"]);
  const [done, setDone] = useState(false);

  const results = useMemo(() => {
    return [...temples].sort((a, b) => {
      const score = (t: typeof temples[number]) => {
        let s = 0;
        if (selected.includes(t.deity)) s += 5;
        if (selected.includes("Lord Shiva") && t.deity.includes("Shiva")) s += 4;
        if (selected.includes("Lord Vishnu / Krishna") && (t.deity.includes("Vishnu") || t.deity.includes("Krishna"))) s += 4;
        if (selected.includes("Goddess") && t.deity.includes("Goddess")) s += 4;
        if (selected.includes("Architecture")) s += 2;
        if (selected.includes("History")) s += t.type.includes("Historic") ? 3 : 1;
        if (selected.includes("Nature")) s += ["North India", "West India"].includes(t.region) ? 2 : 1;
        if (selected.includes("Jyotirlinga") && t.type === "Jyotirlinga") s += 5;
        return s;
      };
      return score(b) - score(a);
    }).slice(0, 4);
  }, [selected]);

  function toggle(item: string) {
    setSelected((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item]);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Smart discovery</div>
        <h1>Find Your Temple</h1>
        <p>Choose what interests you and get personalized temple suggestions from the heritage collection.</p>
      </section>

      <section className="section section-light">
        <div className="recommend-grid">
          <div className="panel">
            <h3>What are you looking for?</h3>
            <div className="preference-list">
              {options.map((item) => (
                <label className="pref" key={item}>
                  <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <button className="btn-primary" style={{ background: "#a52d15", color: "white", border: 0, width: "100%", marginTop: 20 }} onClick={() => setDone(true)}>
              <Sparkles size={17} /> Recommend Temples
            </button>
          </div>

          <div className="panel">
            <h3>{done ? "Your recommendations" : "Recommendations preview"}</h3>
            {results.map((temple) => (
              <Link href={`/temples/${temple.slug}`} className="result-card" key={temple.slug}>
                <img src={temple.image} alt={temple.name} />
                <div style={{ flex: 1 }}>
                  <h4>{temple.name}</h4>
                  <p>📍 {temple.city}, {temple.state}</p>
                  <p style={{ marginTop: 6 }}>{temple.shortDescription}</p>
                </div>
                <ArrowRight size={18} color="#a52d15" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
