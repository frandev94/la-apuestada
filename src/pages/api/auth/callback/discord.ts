import type { APIRoute } from 'astro';
import { AstroAuth } from 'auth-astro/server';

// auth-astro ships its handler as a catch-all, but it returns a 200 with a
// Location header on error and the success redirect sometimes lands on
// /api/auth/error?error=... instead of /. Override the callback so we
// always end up at home, while still letting auth-astro do the OAuth
// exchange and set the session cookie.
const { GET: authGet, POST: authPost } = AstroAuth();

const redirectToHome = async (
  context: Parameters<APIRoute>[0],
  handler: (c: Parameters<APIRoute>[0]) => Promise<Response>,
): Promise<Response> => {
  const res = await handler(context);

  // Forward any Set-Cookie headers from auth-astro (e.g. session cookie)
  // onto our own redirect response.
  const headers = new Headers({ Location: '/' });
  const setCookies = res?.headers?.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    headers.append('Set-Cookie', cookie);
  }

  return new Response(null, { status: 302, headers });
};

export const GET: APIRoute = (context) => redirectToHome(context, authGet);
export const POST: APIRoute = (context) => redirectToHome(context, authPost);
