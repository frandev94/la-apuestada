import { getSession } from 'auth-astro/server';
import { getUserByEmail } from './db/user-repository';

export const getUserFromRequest = async (request: Request) => {
  const session = await getSession(request);
  const user = await getUserByEmail(session?.user?.email || '');
  return user;
};
