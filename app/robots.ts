import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/login",
        "/signup",
        "/logout",
        "/forgot-password",
        "/reset-password",
        "/profile",
        "/my-yatras",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
