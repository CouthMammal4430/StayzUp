import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Bypass explicite de l'auth (pour tests/admin) via variable d'env
  // ATTENTION: à désactiver en production une fois l'auth en place
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    return NextResponse.next();
  }

  // Si Supabase n'est pas configuré, laisser passer toutes les routes
  // (mode développement sans backend)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Routes protégées - rediriger vers /login si non authentifié
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Si l'utilisateur est connecté et qu'il essaie d'accéder à /login ou /signup, rediriger vers /dashboard
    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    // En cas d'erreur, laisser passer la requête
    console.error("Middleware error:", error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

