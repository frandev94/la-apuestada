import { defineMiddleware, sequence } from 'astro:middleware';
import type { Session } from '@auth/core/types';
import { getSession } from 'auth-astro/server';
import { generateUUID } from './lib/crypto';
import { createOrUpdateUser, getUserByEmail } from './lib/db/user-repository';

const authCookieName = 'la_apuestada_auth';

/**
 * Middleware to handle user session and authentication cookies.
 * It retrieves the session from the request and sets it in locals.
 */
const sessionMiddleware = defineMiddleware(
  async ({ locals, request }, next) => {
    const session = await getSession(request);
    locals.session = session;
    return next();
  },
);

/**
 * Middleware to manage the authentication cookie based on the session.
 * It sets or removes the 'la_apuestada_auth' cookie based on the user's email in the session.
 */
const authCookieMiddleware = defineMiddleware(
  async ({ locals, cookies }, next) => {
    const session = locals.session as Session;
    const cookieEmail = cookies.get(authCookieName)?.value;

    if (session?.user?.email) {
      const email = session.user.email;
      if (!cookieEmail || cookieEmail !== email) {
        cookies.set(authCookieName, email, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          expires: session.expires ? new Date(session.expires) : undefined,
        });
        // create user if needed
        if (session?.user?.email && session?.user?.name) {
          const { email, image, name } = session.user;
          await createOrUpdateUser({
            id: generateUUID(),
            email,
            image,
            name,
          }).catch((error) => {
            console.error(
              'Error creating or updating user:',
              { email, image, name },
              error,
            );
          });
        }
      }
      return next();
    }

    if (cookieEmail) {
      cookies.delete(authCookieName);
    }
    return next();
  },
);

/**
 * Middleware to protect admin routes.
 * It redirects non-admin and unauthenticated users away from /admin routes.
 */
const adminProtectionMiddleware = defineMiddleware(
  async ({ locals, request, redirect }, next) => {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/admin')) {
      const session = locals.session;
      const email = session?.user?.email;
      if (!email) {
        return redirect('/');
      }
      const user = await getUserByEmail(email);
      if (!user?.isAdmin) {
        return redirect('/');
      }
    }
    return next();
  },
);

const corsMiddleware = defineMiddleware(async ({ request }, next) => {
  if (request.method === 'OPTIONS') {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    headers.append(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    return new Response(null, { headers });
  }

  const response = await next();

  const headers = new Headers(response.headers);
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  headers.append(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );

  return new Response(response.body, {
    ...response,
    headers: headers,
  });
});

/**
 * Combined middleware to handle session and authentication cookie management.
 */
const sessionAndAuthMiddleware = sequence(
  sessionMiddleware,
  authCookieMiddleware,
);

export const onRequest = sequence(
  sessionAndAuthMiddleware,
  adminProtectionMiddleware,
);
