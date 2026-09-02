// Sun-sign (Western tropical zodiac) lookup, purely from a birth date —
// no birth time/place needed, unlike a true Vedic Moon-sign (Rashi) which
// requires an ephemeris. This keeps the feature honest about what it is:
// a fun, traditional "which deity suits your sign" pointer, not a formal
// astrological chart.

export type ZodiacSign = {
  name: string;
  symbol: string;
  dateRange: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  rulingPlanet: string;
};

// Ordered by the date range's start month/day so getZodiacSign can walk
// through and find the first match.
const ZODIAC_SIGNS: (ZodiacSign & { start: [number, number]; end: [number, number] })[] = [
  { name: "Capricorn", symbol: "♑", dateRange: "Dec 22 – Jan 19", element: "Earth", rulingPlanet: "Saturn", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", symbol: "♒", dateRange: "Jan 20 – Feb 18", element: "Air", rulingPlanet: "Saturn", start: [1, 20], end: [2, 18] },
  { name: "Pisces", symbol: "♓", dateRange: "Feb 19 – Mar 20", element: "Water", rulingPlanet: "Jupiter", start: [2, 19], end: [3, 20] },
  { name: "Aries", symbol: "♈", dateRange: "Mar 21 – Apr 19", element: "Fire", rulingPlanet: "Mars", start: [3, 21], end: [4, 19] },
  { name: "Taurus", symbol: "♉", dateRange: "Apr 20 – May 20", element: "Earth", rulingPlanet: "Venus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", symbol: "♊", dateRange: "May 21 – Jun 20", element: "Air", rulingPlanet: "Mercury", start: [5, 21], end: [6, 20] },
  { name: "Cancer", symbol: "♋", dateRange: "Jun 21 – Jul 22", element: "Water", rulingPlanet: "Moon", start: [6, 21], end: [7, 22] },
  { name: "Leo", symbol: "♌", dateRange: "Jul 23 – Aug 22", element: "Fire", rulingPlanet: "Sun", start: [7, 23], end: [8, 22] },
  { name: "Virgo", symbol: "♍", dateRange: "Aug 23 – Sep 22", element: "Earth", rulingPlanet: "Mercury", start: [8, 23], end: [9, 22] },
  { name: "Libra", symbol: "♎", dateRange: "Sep 23 – Oct 22", element: "Air", rulingPlanet: "Venus", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", symbol: "♏", dateRange: "Oct 23 – Nov 21", element: "Water", rulingPlanet: "Mars", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", symbol: "♐", dateRange: "Nov 22 – Dec 21", element: "Fire", rulingPlanet: "Jupiter", start: [11, 22], end: [12, 21] },
];

export function getZodiacSign(birthDate: string): ZodiacSign | null {
  // Expect "YYYY-MM-DD" from an <input type="date">.
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    const afterStart = month > startMonth || (month === startMonth && day >= startDay);
    const beforeEnd = month < endMonth || (month === endMonth && day <= endDay);

    // Capricorn wraps across the new year (Dec 22 – Jan 19).
    const inRange = startMonth > endMonth ? afterStart || beforeEnd : afterStart && beforeEnd;

    if (inRange) {
      const { start: _s, end: _e, ...publicFields } = sign;
      return publicFields;
    }
  }
  return null;
}

// Traditional planet -> deity association used in Indian folk astrology
// (Navagraha worship) for pointing each sign toward a form of the divine
// associated with its ruling planet. Mapped here to the deity families
// actually present in this app's temple dataset, plus a short "why" line
// for the UI.
export type HoroscopeGuidance = {
  deityFocus: string[]; // matches against Temple.deity substrings
  typeFocus?: string[]; // matches against Temple.type, as a bonus
  blurb: string;
};

const PLANET_GUIDANCE: Record<string, HoroscopeGuidance> = {
  Sun: {
    deityFocus: ["Surya"],
    blurb: "Leo is ruled by the Sun (Surya) — temples devoted to the Sun God are considered especially auspicious for you.",
  },
  Moon: {
    deityFocus: ["Shiva"],
    blurb: "Cancer is ruled by the Moon (Chandra), who rests on Shiva's head in classical iconography — Shiva temples are traditionally favoured for this sign.",
  },
  Mars: {
    deityFocus: ["Shiva"],
    blurb: "Mars (Mangal) is closely linked with Shiva's family in Vedic tradition — Shiva temples, especially the Jyotirlingas, are a strong match.",
  },
  Mercury: {
    deityFocus: ["Krishna", "Vishnu", "Venkateswara", "Jagannath"],
    blurb: "Mercury (Budha) governs intellect and communication — Vishnu/Krishna temples are traditionally recommended to sharpen these qualities.",
  },
  Jupiter: {
    deityFocus: ["Vishnu", "Krishna", "Venkateswara", "Jagannath"],
    blurb: "Jupiter (Guru/Brihaspati) is considered Vishnu's own planet — Vishnu temples are held to bring Jupiter's blessings of wisdom and fortune.",
  },
  Venus: {
    deityFocus: ["Goddess", "Meenakshi"],
    blurb: "Venus (Shukra) governs beauty, grace and abundance — temples of the Goddess are the traditional match for this sign.",
  },
  Saturn: {
    deityFocus: ["Shiva"],
    typeFocus: ["Jyotirlinga"],
    blurb: "Saturn (Shani) is worshipped alongside Shiva for relief from hardship — the Jyotirlinga temples are especially significant for this sign.",
  },
};

export function getHoroscopeGuidance(sign: ZodiacSign): HoroscopeGuidance {
  return PLANET_GUIDANCE[sign.rulingPlanet];
}
