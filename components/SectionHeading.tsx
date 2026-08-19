type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
};

export function SectionHeading({ eyebrow, title, description, dark }: Props) {
  return (
    <div className={`section-heading ${dark ? "section-dark" : ""}`}>
      {eyebrow && <div className="eyebrow">✦ {eyebrow}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <div className="underline" />
    </div>
  );
}
