/**
 * Resolves the deployed site's origin. Prefers an explicit
 * NEXT_PUBLIC_SITE_URL (set once a custom domain is attached), falls back to
 * Vercel's auto-injected URL, then localhost for local dev.
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

/**
 * next/og's ImageResponse fetches <img src> over the network — it has no
 * concept of the Next.js public/ folder, so a relative path like
 * "/images/foo.png" silently fails to render. Absolute (http/https) URLs are
 * left untouched; relative paths are resolved against the site origin.
 */
export function resolveImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, getSiteUrl()).toString();
}
