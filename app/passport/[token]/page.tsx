// app/passport/[token]/page.tsx
import { notFound } from "next/navigation";
import { getPassportByShareToken } from "@/lib/passport";
import PassportView from "@/components/PassportView";
import type { Metadata } from "next";

type Props = { params: { token: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const passport = await getPassportByShareToken(params.token);
  if (!passport) return { title: "Passport not found" };

  const title = `${passport.username ?? "A pilgrim"}'s Pilgrimage Passport`;
  const description = `${passport.stamps.length} of ${passport.totalTemples} sacred sites visited on India's Sacred Heritage Portal`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/passport/${params.token}/opengraph-image`],
    },
  };
}

export default async function SharedPassportPage({ params }: Props) {
  const passport = await getPassportByShareToken(params.token);
  if (!passport) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <PassportView passport={passport} isOwner={false} />
    </main>
  );
}
