import { count, eq, like } from 'drizzle-orm';
import { db } from './client';
import { usersTable } from './schema';

export type UserRecord = typeof usersTable.$inferSelect;
export type CreateUserRecord = typeof usersTable.$inferInsert & {
  id: string;
  image?: string | null;
  isAdmin?: boolean;
};

/**
 * Creates a new user
 */
export async function createUser(
  userData: CreateUserRecord,
): Promise<UserRecord> {
  const result = (await db
    .insert(usersTable)
    .values(userData)
    .returning()) as UserRecord[];
  return result[0] as UserRecord;
}

/**
 * Gets all users from the database (without sensitive data)
 */
export async function getAllUsers(): Promise<UserRecord[]> {
  return (await db.select().from(usersTable)) as UserRecord[];
}

/**
 * Gets a user by ID
 */
export async function getUserById(userId: string): Promise<UserRecord | null> {
  const result = (await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1)) as UserRecord[];
  return result.length > 0 ? (result[0] as UserRecord) : null;
}

/**
 * Gets a user by email
 */
export async function getUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const result = (await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1)) as UserRecord[];
  return result.length > 0 ? (result[0] as UserRecord) : null;
}

/**
 * Creates a new user or updates an existing one based on email
 */
export const createOrUpdateUser = async (
  userData: CreateUserRecord,
): Promise<UserRecord> => {
  if (!userData.email) {
    return createUser(userData);
  }
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    const needsUpdate =
      existingUser.name !== userData.name ||
      existingUser.image !== userData.image;
    if (needsUpdate) {
      const result = (await db
        .update(usersTable)
        .set({ name: userData.name, image: userData.image })
        .where(eq(usersTable.id, existingUser.id))
        .returning()) as UserRecord[];
      return result[0] as UserRecord;
    }
    return existingUser;
  }
  const result = (await db
    .insert(usersTable)
    .values(userData)
    .returning()) as UserRecord[];
  return result[0] as UserRecord;
};

/**
 * Updates a user's information
 */
export async function updateUser(
  userId: string,
  updates: CreateUserRecord,
): Promise<UserRecord | null> {
  const existingUser = await getUserById(userId);
  if (!existingUser) {
    return null;
  }

  const updateData: Partial<UserRecord> = {};
  if (updates.name !== undefined) {
    updateData.name = updates.name;
  }
  if (updates.email !== undefined) {
    updateData.email = updates.email;
  }

  const result = (await db
    .update(usersTable)
    .set(updateData)
    .where(eq(usersTable.id, userId))
    .returning()) as UserRecord[];

  return result.length > 0 ? (result[0] as UserRecord) : null;
}

/**
 * Deletes a user by ID
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const result = await db.delete(usersTable).where(eq(usersTable.id, userId));
    return Number(result.rowsAffected ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

/**
 * Gets the total number of users
 */
export async function getTotalUsers(): Promise<number> {
  const result = (await db
    .select({ total: count() })
    .from(usersTable)) as Array<{ total: number }>;
  return result[0]?.total ?? 0;
}

/**
 * Searches users by name (case-insensitive partial match)
 */
export async function searchUsersByName(
  searchTerm: string,
): Promise<UserRecord[]> {
  const pattern = `%${searchTerm.toLowerCase()}%`;
  return (await db
    .select()
    .from(usersTable)
    .where(like(usersTable.name, pattern))) as UserRecord[];
}

/**
 * Gets recently created users (last N users)
 */
export async function getRecentUsers(limit = 10): Promise<UserRecord[]> {
  return (await db
    .select()
    .from(usersTable)
    .orderBy(usersTable.createdAt)
    .limit(limit)) as UserRecord[];
}

/**
 * Clears all users from the database (use with caution!)
 */
export async function clearAllUsers(): Promise<boolean> {
  try {
    await db.delete(usersTable);
    return true;
  } catch (error) {
    console.error('Error clearing users:', error);
    return false;
  }
}
