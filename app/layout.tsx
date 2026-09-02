import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import { WelcomeLoginModal } from "@/components/WelcomeLoginModal";

// Needed so OG image tags (built from the colocated opengraph-image.tsx
// files) resolve to an absolute URL. Falls back to Vercel's
// auto-injected URL, then localhost for local dev — set
// NEXT_PUBLIC_SITE_URL once a custom domain is attached.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Temple Heritage | India's Sacred Heritage",
  description: "Discover India's temples, festivals and personalized pilgrimage journeys."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Navbar />
          {children}
          <FloatingChat />
          <Footer />
        </div>
        <WelcomeLoginModal />
      </body>
    </html>
  );
}
