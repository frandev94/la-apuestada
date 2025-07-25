import { getSession } from 'auth-astro/server';
import { getUserByEmail } from './db/user-repository';

export const getUserFromRequest = async (request: Request) => {
  const session = await getSession(request);
  const user = await getUserByEmail(session?.user?.email || '');
  return user;
};

export const getUserAndSessionFromRequest = async (request: Request) => {
  const session = await getSession(request);
  const user = await getUserFromRequest(request);
  return { user, session };
};
