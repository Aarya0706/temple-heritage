// app/profile/passport/page.tsx
import { redirect } from "next/navigation";
import { getOwnPassport } from "@/lib/passport";
import PassportView from "@/components/PassportView";

export default async function OwnPassportPage() {
  const passport = await getOwnPassport();
  if (!passport) redirect("/login");

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <PassportView passport={passport} isOwner />
    </main>
  );
}
