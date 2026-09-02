import { SectionHeading } from "@/components/SectionHeading";
import { TempleExplorer } from "@/components/TempleExplorer";
import AllTemplesMapLoader from "@/components/AllTemplesMapLoader";
import { temples } from "@/data/temples";

export default function TemplesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Explore the sacred map</div>
        <h1>Browse Temples</h1>
        <p>Search temples by name, deity, city, state or region and open a detailed heritage profile.</p>
      </section>
      <section className="section section-light">
        <AllTemplesMapLoader temples={temples} />
        <TempleExplorer />
      </section>
    </main>
  );
}
