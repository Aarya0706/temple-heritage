"use client";

import { useState, type ReactNode } from "react";

export type TempleTab = {
  id: string;
  label: string;
  content: ReactNode;
};

type TempleTabsProps = {
  tabs: TempleTab[];
};

export default function TempleTabs({ tabs }: TempleTabsProps) {
  // Respect a deep link like /temples/slug#reviews (e.g. the redirect
  // after logging in to write a review) by opening that tab on load.
  const [activeId, setActiveId] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && tabs.some((tab) => tab.id === hash)) {
        return hash;
      }
    }
    return tabs[0]?.id;
  });

  if (tabs.length === 0) return null;

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  const selectTab = (id: string) => {
    setActiveId(id);
    if (window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="temple-tabs">
      <nav className="detail-subnav" aria-label="Sections on this page">
        <div className="detail-subnav-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={
                "detail-subnav-link" +
                (activeTab.id === tab.id ? " detail-subnav-link-active" : "")
              }
              aria-current={activeTab.id === tab.id ? "true" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="temple-tab-panel" key={activeTab.id}>
        {activeTab.content}
      </div>
    </div>
  );
}
