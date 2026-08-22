import { createClient } from "@/lib/supabase/server";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let email: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    displayName =
      profile?.full_name ||
      user.email?.split("@")[0] ||
      "Account";

    email = user.email || null;
  }

  return (
    <NavbarClient
      displayName={displayName}
      email={email}
    />
  );
}