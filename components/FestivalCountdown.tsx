"use client";

import { useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { formatFestivalDate } from "@/lib/festival-countdown";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Live countdown to a festival's verified `date2026`. If that date has
 * already passed, shows an honest "just celebrated" note instead of a
 * fabricated countdown — the real next date depends on next year's
 * lunar calendar, which isn't in the data set yet.
 */
export default function FestivalCountdown({
  festivalName,
  date2026,
  compact = false,
}: {
  festivalName: string;
  date2026: string;
  compact?: boolean;
}) {
  const target = new Date(`${date2026}T00:00:00`);
  // Start as null on both server and the client's first render pass, and only
  // compute the real (Date.now()-based) value after mount. Computing it eagerly
  // in the useState initializer runs once on the server and again on the client
  // a few seconds later, so the server and client markup disagree on the
  // seconds/minutes shown — a classic hydration mismatch. Deferring the real
  // value to useEffect keeps the first client render identical to the SSR
  // output; the ticking numbers then appear a beat after mount, which is
  // invisible to the user.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date2026]);

  if (!mounted) {
    // Same shape as the "counting down" state below, with placeholder dashes,
    // so there's no layout shift once the real numbers appear a moment later.
    return (
      <div className={`festival-countdown ${compact ? "festival-countdown-compact" : ""}`}>
        {!compact && (
          <div className="festival-countdown-label">
            <CalendarHeart size={16} />
            <span>Countdown to {festivalName} · {formatFestivalDate(target)}</span>
          </div>
        )}
        <div className="festival-countdown-units">
          {["days", "hrs", "min", "sec"].map((label) => (
            <div className="festival-countdown-unit" key={label}>
              <span className="festival-countdown-value">--</span>
              <span className="festival-countdown-unit-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className={`festival-countdown festival-countdown-passed ${compact ? "festival-countdown-compact" : ""}`}>
        <CalendarHeart size={compact ? 15 : 18} />
        <span>{festivalName} was celebrated on {formatFestivalDate(target)} this year.</span>
      </div>
    );
  }

  const units: [number, string][] = [
    [timeLeft.days, "days"],
    [timeLeft.hours, "hrs"],
    [timeLeft.minutes, "min"],
    [timeLeft.seconds, "sec"],
  ];

  return (
    <div className={`festival-countdown ${compact ? "festival-countdown-compact" : ""}`}>
      {!compact && (
        <div className="festival-countdown-label">
          <CalendarHeart size={16} />
          <span>Countdown to {festivalName} · {formatFestivalDate(target)}</span>
        </div>
      )}
      <div className="festival-countdown-units">
        {units.map(([value, label]) => (
          <div className="festival-countdown-unit" key={label}>
            <span className="festival-countdown-value">{String(value).padStart(2, "0")}</span>
            <span className="festival-countdown-unit-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
