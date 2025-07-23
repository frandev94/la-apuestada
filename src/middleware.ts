import { defineMiddleware, sequence } from 'astro:middleware';
import type { Session, User } from '@auth/core/types';
import { getSession } from 'auth-astro/server';
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
        if (session?.user?.email && session?.user?.name)
          await createUserIfNeeded(session.user);
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

/**
 * Combined middleware to handle session and authentication cookie management.
 */
const sessionAndAuthMiddleware = sequence(
  sessionMiddleware,
  authCookieMiddleware,
);

/**
 *
 */
const createUserIfNeeded = async ({ email, image, name }: User) => {
  try {
    if (!email || !name) return;
    const upsertUser = await createOrUpdateUser({ email, name, image });
    if (upsertUser.id) {
      console.log('User created or updated:', upsertUser.id);
    } else {
      throw new Error('User creation or update failed');
    }
    return upsertUser;
  } catch (error) {
    throw new Error(`Error creating or updating user: ${error}`);
  }
};

export const onRequest = sequence(
  sessionAndAuthMiddleware,
  adminProtectionMiddleware,
);
