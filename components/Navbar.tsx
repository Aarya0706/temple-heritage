import { createClient } from "@/lib/supabase/server";
import { NavbarClient } from "./NavbarClient";
import { AnnouncementBar } from "./AnnouncementBar";

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let email: string | null = null;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, is_admin")
      .eq("id", user.id)
      .single();

    displayName =
      profile?.full_name ||
      user.email?.split("@")[0] ||
      "Account";

    email = user.email || null;
    isAdmin = !!profile?.is_admin;
  }

  return (
    <>
      <AnnouncementBar />
      <NavbarClient
        displayName={displayName}
        email={email}
        isAdmin={isAdmin}
      />
    </>
  );
}