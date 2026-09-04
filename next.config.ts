import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage public URLs (review photos), e.g.
      // https://<project-ref>.supabase.co/storage/v1/object/public/...
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
