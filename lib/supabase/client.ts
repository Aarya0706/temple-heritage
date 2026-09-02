import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Default PKCE flow requires the *same browser* that requested a
        // password reset to also complete it -- the code verifier it needs
        // lives only in that browser's local storage. That breaks the
        // common case of requesting a reset on desktop and opening the
        // email on your phone ("Auth session missing!"). Implicit flow
        // delivers tokens directly in the redirect URL instead, so it
        // works from any device. Safe here since this app only does
        // email+password auth -- no OAuth or magic links to worry about.
        flowType: 'implicit',
      },
    }
  )
}