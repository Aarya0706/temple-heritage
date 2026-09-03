import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import { WelcomeLoginModal } from "@/components/WelcomeLoginModal";
import { getSiteUrl } from "@/lib/site-url";

const title = "Temple Heritage | India's Sacred Heritage";
const description =
  "Discover India's temples, festivals and personalized pilgrimage journeys.";

export const metadata: Metadata = {
  // Needed so OG image tags (built from the colocated opengraph-image.tsx
  // files) resolve to an absolute URL.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: title,
    template: "%s | Temple Heritage",
  },
  description,
  openGraph: {
    title,
    description,
    siteName: "Temple Heritage",
    type: "website",
    locale: "en_IN",
    // Routes without their own opengraph-image.tsx (e.g. /, /about,
    // /planner) fall back to this root-level image.
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
