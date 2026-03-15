import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session
  const { data: { user } } = await supabase.auth.getUser();

  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Define your platform's apex domain
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'venusapp.in';
  
  // 2. Extract current subdomain/hostname
  const currentHost = 
    process.env.NODE_ENV === "production" 
      ? hostname.replace(`.${platformDomain}`, "")
      : hostname.replace(`.localhost:3000`, "");

  // 3. Prevent infinite loops and ignore main domain/common subdomains
  const isMainDomain = hostname === platformDomain || hostname === `www.${platformDomain}` || hostname === 'localhost:3000';
  const isExcludedSubdomain = currentHost === "app" || currentHost === "api" || currentHost === "studio";

  // 4. Email Confirmation Guard (Professional Auth Flow)
  const publicRoutes = ['/login', '/signup', '/verify-email', '/auth/callback'];
  const isPublicRoute = publicRoutes.includes(url.pathname);
  
  // If user is logged in but NOT confirmed, redirect them to verify-email if they try to access protected studio/dashboard routes
  const isStudioRoute = isExcludedSubdomain || url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/leads') || url.pathname.startsWith('/projects');
  
  if (user && !user.email_confirmed_at && isStudioRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL('/verify-email', req.url));
  }

  if (!isMainDomain && !isExcludedSubdomain) {
     // This is a project subdomain (e.g. serenity-villa.venusapp.io)
     // Rewrite to /p/[slug] internally
     if (!url.pathname.startsWith('/p/')) {
       return NextResponse.rewrite(new URL(`/p/${currentHost}${url.pathname === '/' ? '' : url.pathname}`, req.url), {
         request: {
           headers: res.headers,
         }
       });
     }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
