import { describe, it, expect } from "vitest";
import {
  buildOsrmUrl,
  parseOsrmResponse,
  formatDuration,
  toStraightLineLegs,
  describeLeg,
  fetchTimedLegs,
} from "./route-time";
import type { RouteLeg } from "./route-optimize";

const points = [
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Ujjain", lat: 23.1793, lng: 75.7849 },
  { name: "Omkareshwar", lat: 22.2431, lng: 76.1517 },
];

const legs: RouteLeg[] = [
  { from: "Bhopal", to: "Ujjain", km: 150 },
  { from: "Ujjain", to: "Omkareshwar", km: 140 },
];

describe("buildOsrmUrl", () => {
  it("orders coordinates as lng,lat and joins stops with ;", () => {
    const url = buildOsrmUrl(points);
    expect(url).toBe(
      "https://router.project-osrm.org/route/v1/driving/" +
        "77.4126,23.2599;75.7849,23.1793;76.1517,22.2431" +
        "?overview=false&annotations=false&steps=false"
    );
  });
});

describe("parseOsrmResponse", () => {
  it("maps matching legs to road distance + duration", () => {
    const result = parseOsrmResponse(
      {
        code: "Ok",
        routes: [
          {
            legs: [
              { distance: 152300, duration: 10800 },
              { distance: 141000, duration: 9600 },
            ],
          },
        ],
      },
      legs
    );

    expect(result).toEqual([
      { from: "Bhopal", to: "Ujjain", km: 150, roadKm: 152.3, durationMin: 180, source: "road" },
      { from: "Ujjain", to: "Omkareshwar", km: 140, roadKm: 141, durationMin: 160, source: "road" },
    ]);
  });

  it("returns null when the response status isn't Ok", () => {
    expect(parseOsrmResponse({ code: "NoRoute" }, legs)).toBeNull();
  });

  it("returns null when the leg count doesn't match", () => {
    expect(
      parseOsrmResponse({ code: "Ok", routes: [{ legs: [{ distance: 1, duration: 1 }] }] }, legs)
    ).toBeNull();
  });

  it("returns null for a malformed body", () => {
    expect(parseOsrmResponse(null, legs)).toBeNull();
    expect(parseOsrmResponse("not json", legs)).toBeNull();
  });
});

describe("formatDuration", () => {
  it("formats minutes under an hour", () => {
    expect(formatDuration(45)).toBe("45m");
  });

  it("formats whole hours without a minutes part", () => {
    expect(formatDuration(120)).toBe("2h");
  });

  it("formats hours and minutes together", () => {
    expect(formatDuration(200)).toBe("3h 20m");
  });

  it("never rounds down to 0m", () => {
    expect(formatDuration(0.2)).toBe("1m");
  });
});

describe("toStraightLineLegs / describeLeg", () => {
  it("marks fallback legs as straight-line with no duration", () => {
    const [leg] = toStraightLineLegs(legs);
    expect(leg.source).toBe("straight-line");
    expect(leg.durationMin).toBeNull();
    expect(describeLeg(leg)).toBe("150 km");
  });

  it("includes an approximate driving time for road legs", () => {
    const leg = { ...legs[0], roadKm: 152.3, durationMin: 180, source: "road" as const };
    expect(describeLeg(leg)).toBe("152 km · ~3h");
  });
});

describe("fetchTimedLegs", () => {
  it("falls back to straight-line legs when the routing service errors", async () => {
    const failing = async () => {
      throw new Error("network down");
    };
    const result = await fetchTimedLegs(points, legs, failing as unknown as typeof fetch);
    expect(result.every((l) => l.source === "straight-line")).toBe(true);
  });

  it("falls back to straight-line legs on a non-OK HTTP response", async () => {
    const notOk = async () => ({ ok: false, json: async () => ({}) }) as Response;
    const result = await fetchTimedLegs(points, legs, notOk as unknown as typeof fetch);
    expect(result.every((l) => l.source === "straight-line")).toBe(true);
  });

  it("returns road legs when the routing service responds cleanly", async () => {
    const ok = async () =>
      ({
        ok: true,
        json: async () => ({
          code: "Ok",
          routes: [
            {
              legs: [
                { distance: 150000, duration: 9000 },
                { distance: 140000, duration: 8400 },
              ],
            },
          ],
        }),
      }) as Response;
    const result = await fetchTimedLegs(points, legs, ok as unknown as typeof fetch);
    expect(result.every((l) => l.source === "road")).toBe(true);
    expect(result[0].durationMin).toBe(150);
  });

  it("returns an empty array when there are no legs", async () => {
    const result = await fetchTimedLegs([], [], (async () => {
      throw new Error("should not be called");
    }) as unknown as typeof fetch);
    expect(result).toEqual([]);
  });
});
