import { DarshanExplorer } from "@/components/DarshanExplorer";

export default function DarshanPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Plan your darshan</div>
        <h1>Darshan Timings</h1>
        <p>Search any temple by name, deity, city, state or region to check its darshan timings before you go.</p>
      </section>
      <section className="section section-light">
        <DarshanExplorer />
        <p style={{ marginTop: 30, opacity: 0.7, fontSize: 14 }}>
          Timings can shift around festivals, special sewa and seasonal changes — it's worth confirming with the temple directly before you travel.
        </p>
      </section>
    </main>
  );
}
