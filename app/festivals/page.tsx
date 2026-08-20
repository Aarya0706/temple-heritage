import { CalendarDays, MapPin } from "lucide-react";
import { festivals } from "@/data/festivals";

export default function FestivalsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Sacred calendar</div>
        <h1>Festival Calendar</h1>
        <p>Explore major Indian festivals, the places where they shine brightest and the traditions around them.</p>
      </section>
      <section className="section section-light">
        <div className="section-heading">
          <div className="eyebrow">✦ Plan your season</div>
          <h2>Upcoming & major festivals</h2>
          <p>Use these as planning anchors when deciding where and when to travel.</p>
          <div className="underline" />
        </div>
        <div className="services" style={{ maxWidth: 1100 }}>
          {festivals.map((festival) => (
            <article className="service-card" key={`${festival.month}-${festival.name}`} style={{ background: "#fff", color: "#4d1710", borderColor: "rgba(150,50,20,.14)" }}>
              <div className="service-icon" style={{ color: "#a42b14" }}><CalendarDays /></div>
              <div className="eyebrow">{festival.month}</div>
              <h3>{festival.name}</h3>
              <p><MapPin size={15} style={{ verticalAlign: "middle" }} /> {festival.place}</p>
              <p>{festival.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
