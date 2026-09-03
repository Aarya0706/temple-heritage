import type { MetadataRoute } from "next";
import { temples } from "@/data/temples";
import { festivals } from "@/data/festivals";
import { slugify } from "@/lib/slug";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/temples`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/festivals`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/planner`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/recommender`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/darshan`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/horoscope`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const templeRoutes: MetadataRoute.Sitemap = temples.map((temple) => ({
    url: `${siteUrl}/temples/${temple.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const festivalRoutes: MetadataRoute.Sitemap = festivals.map((festival) => ({
    url: `${siteUrl}/festivals/${slugify(festival.name)}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...templeRoutes, ...festivalRoutes];
}
