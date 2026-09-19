"use client";

import { useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { formatFestivalDate } from "@/lib/festival-countdown";
import { parseDurationDays } from "@/lib/ics";

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
 * Live countdown to a festival's verified `date2026`. Once that date
 * arrives, the festival isn't necessarily over — `duration` (e.g. "10 days"
 * for Ganesh Chaturthi) says how many days it actually runs, so this shows
 * an "on now, through <end date>" state for the whole run and only falls
 * back to the honest "was celebrated" note once the LAST day has passed.
 * The real next-year date depends on next year's lunar calendar, which
 * isn't in the data set yet.
 */
export default function FestivalCountdown({
  festivalName,
  date2026,
  duration,
  compact = false,
}: {
  festivalName: string;
  date2026: string;
  duration: string;
  compact?: boolean;
}) {
  const target = new Date(`${date2026}T00:00:00`);
  const spanDays = parseDurationDays(duration);
  const endDate = new Date(target);
  endDate.setDate(endDate.getDate() + spanDays - 1);
  // End of the last calendar day, so the festival still counts as "ongoing"
  // for the whole of its final day rather than cutting off at midnight.
  const endOfCelebration = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    23, 59, 59, 999
  );

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
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Defer the first state update out of the effect body itself (same
    // reasoning as elsewhere in this codebase): calling setState synchronously
    // during the effect can trigger an extra cascading render before the
    // interval even starts. A microtask tick avoids that while still updating
    // before the next paint in practice.
    Promise.resolve().then(() => {
      if (cancelled) return;
      setMounted(true);
      setTimeLeft(getTimeLeft(target));
      setNowMs(Date.now());
    });

    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
      setNowMs(Date.now());
    }, 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date2026, duration]);

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

  const isOngoing = nowMs !== null && nowMs >= target.getTime() && nowMs <= endOfCelebration.getTime();

  if (isOngoing) {
    return (
      <div className={`festival-countdown festival-countdown-ongoing ${compact ? "festival-countdown-compact" : ""}`}>
        <CalendarHeart size={compact ? 15 : 18} />
        <span>
          {festivalName} celebrations are on now — continuing through {formatFestivalDate(endDate)}.
        </span>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className={`festival-countdown festival-countdown-passed ${compact ? "festival-countdown-compact" : ""}`}>
        <CalendarHeart size={compact ? 15 : 18} />
        <span>
          {festivalName} was celebrated {formatFestivalDate(target)}
          {spanDays > 1 ? `–${formatFestivalDate(endDate)}` : ""} this year.
        </span>
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
