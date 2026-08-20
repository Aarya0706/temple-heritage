import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";

export const metadata: Metadata = {
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
      </body>
    </html>
  );
}
