import { temples } from "@/data/temples";
import { festivals } from "@/data/festivals";
import { getUpcomingFestivals } from "@/lib/festival-countdown";
import type { FestivalCountdownInfo } from "@/lib/festival-countdown";
import { getHoroscopeGuidance } from "@/lib/zodiac";
import type { ZodiacSign } from "@/lib/zodiac";

/**
 * Bridges the horoscope page to the festival calendar: a sign's ruling
 * planet already points to a deity focus (lib/zodiac.ts, used to score
 * temples in lib/recommend.ts). This walks that same deityFocus one hop
 * further — deity -> temples whose `deity` field matches -> festivals
 * tied to those temples via `relatedTempleSlugs` (the same link
 * lib/auspicious-dates.ts uses for getUpcomingFestivalsForTemple) — to
 * surface the single soonest upcoming festival relevant to this sign.
 *
 * Returns null if nothing upcoming is tied to any temple matching the
 * sign's deity focus, which is an honest "no match" rather than a guess.
 */
export function getUpcomingFestivalForSign(
  sign: ZodiacSign,
  now: Date = new Date()
): FestivalCountdownInfo | null {
  const guidance = getHoroscopeGuidance(sign);

  const matchingTempleSlugs = new Set(
    temples
      .filter((temple) => guidance.deityFocus.some((focus) => temple.deity.includes(focus)))
      .map((temple) => temple.slug)
  );

  const relatedFestivals = festivals.filter((festival) =>
    festival.relatedTempleSlugs.some((slug) => matchingTempleSlugs.has(slug))
  );

  const upcoming = getUpcomingFestivals(relatedFestivals, now);
  return upcoming[0] ?? null;
}
