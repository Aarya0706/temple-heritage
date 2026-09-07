"use client";

import { useEffect, useState } from "react";

type DetailSectionNavProps = {
  sections: { id: string; label: string }[];
};

export default function DetailSectionNav({ sections }: DetailSectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav className="detail-subnav" aria-label="Sections on this page">
      <div className="detail-subnav-inner">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={
              "detail-subnav-link" +
              (activeId === section.id ? " detail-subnav-link-active" : "")
            }
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
