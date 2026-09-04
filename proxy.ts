import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/my-yatras', '/profile', '/admin']

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtected = PROTECTED_PATHS.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  )

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    const redirectResponse = NextResponse.redirect(loginUrl)
    redirectResponse.headers.set('Cache-Control', 'no-store, must-revalidate')
    return redirectResponse
  }

  if (isProtected) {
    // Prevent the browser from serving a logged-in snapshot of this page
    // from the back-forward cache after the user has logged out.
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}