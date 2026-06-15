import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { redis, CACHE_KEYS } from "./lib/redis";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = req.headers.get('host') || '';

  // 1. Precise Matcher Optimization
  // Only target Studio routes for auth logic
  const isStudioRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/projects') || 
    pathname.startsWith('/leads') || 
    pathname.startsWith('/settings') || 
    pathname.startsWith('/billing');

  const isPublicRoute = ['/login', '/signup', '/verify-email', '/auth/callback'].includes(pathname);

  // 2. High-Speed Cookie Gating (The "5ms" fast path)
  if (isStudioRoute && !isPublicRoute) {
    const hasSession = req.cookies.getAll().some(c => c.name.startsWith("sb-"));
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Valid session cookie exists, proceed to Supabase for heavy lifting (Session refresh/Email guard)
    let res = NextResponse.next({
      request: { headers: req.headers },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll(cookiesToSet: any[]) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({ request: { headers: req.headers } });
            cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 3. Email Confirmation Guard (Studio Only)
    if (user && !user.email_confirmed_at && pathname !== '/verify-email') {
      return NextResponse.redirect(new URL('/verify-email', req.url));
    }

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  }

  // 4. Subdomain Routing (Public Projects) - No Auth Logic Needed
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'venusapp.in';
  const isMainDomain = hostname === platformDomain || hostname === `www.${platformDomain}` || hostname === 'localhost:3000';
  
  const currentHost = 
    process.env.NODE_ENV === "production" 
      ? hostname.replace(`.${platformDomain}`, "")
      : hostname.replace(`.localhost:3000`, "");

  const isExcludedSubdomain = currentHost === "app" || currentHost === "api" || currentHost === "studio";

  if (!isMainDomain && !isExcludedSubdomain) {
     // Public project hits skip the getUser() call entirely
     const supabaseAnon = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => req.cookies.getAll() } }
     );

      let targetSlug: string | null = currentHost;

      if (currentHost === hostname) {
        // It's a Custom Domain (e.g., custom.com — not a subdomain of platformDomain)
        const cachedSlug = await redis.get<string>(CACHE_KEYS.CUSTOM_DOMAIN(hostname));

        if (cachedSlug) {
          targetSlug = cachedSlug;
        } else {
          const { data: project } = await supabaseAnon
            .from('projects')
            .select('slug')
            .eq('custom_domain', hostname)
            .single();

          if (project?.slug) {
            targetSlug = project.slug;
            await redis.set(CACHE_KEYS.CUSTOM_DOMAIN(hostname), project.slug, { ex: 3600 }).catch(console.error);
          } else {
            targetSlug = null;
          }
        }
      } else {
        // It's a Subdomain (e.g., project.venusapp.in)
        const { data: project } = await supabaseAnon
          .from('projects')
          .select('id')
          .eq('slug', currentHost)
          .single();

        if (!project) targetSlug = null;
      }

      if (!targetSlug) {
        const { data: redirectData } = await supabaseAnon
          .from('slug_redirects')
          .select('new_slug')
          .eq('old_slug', currentHost)
          .maybeSingle();

       if (redirectData) {
         return NextResponse.redirect(new URL(`${url.protocol}//${redirectData.new_slug}.${platformDomain}${pathname === '/' ? '' : pathname}`), {
           status: 301
         });
       }
       
       // If totally not found, just let it pass to 404
     }

     // Rewrite to /p/[slug]
     if (targetSlug && !pathname.startsWith('/p/')) {
       return NextResponse.rewrite(new URL(`/p/${targetSlug}${pathname === '/' ? '' : pathname}`, req.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
