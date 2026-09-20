// components/StorySection.tsx
// Shared layout for the temple detail page's narrative tabs (History,
// Architecture) -- a single eyebrow + heading + prose block, matching the
// existing detail-section styling used by Highlights and Location.
type StorySectionProps = {
  eyebrow: string;
  heading: string;
  text: string;
};

export default function StorySection({ eyebrow, heading, text }: StorySectionProps) {
  return (
    <section className="detail-section">
      <div className="eyebrow">✦ {eyebrow}</div>
      <h2>{heading}</h2>
      <p style={{ maxWidth: 820 }}>{text}</p>
    </section>
  );
}
