import { User, count, db, eq, like } from 'astro:db';

if (typeof window !== 'undefined')
  throw new Error('This code should not run in the browser');

export type UserRecord = typeof User.$inferSelect;
export type CreateUserRecord = typeof User.$inferInsert & {
  image?: string | null;
  isAdmin?: boolean;
};

/**
 * Creates a new user
 */
export async function createUser(
  userData: CreateUserRecord,
): Promise<UserRecord> {
  const result = await db.insert(User).values(userData).returning();
  return result[0] as UserRecord;
}

/**
 * Gets all users from the database (without sensitive data)
 */
export async function getAllUsers(): Promise<UserRecord[]> {
  const result = await db.select().from(User);
  return result;
}

/**
 * Gets a user by ID
 */
export async function getUserById(userId: string): Promise<UserRecord | null> {
  const result = await db
    .select()
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);
  return result.length > 0 ? (result[0] as UserRecord) : null;
}

/**
 * Gets a user by email
 */
export async function getUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const result = await db
    .select()
    .from(User)
    .where(eq(User.email, email))
    .limit(1);
  return result.length > 0 ? (result[0] as UserRecord) : null;
}

/**
 * Creates a new user or updates an existing one based on email
 */
export const createOrUpdateUser = async (
  userData: CreateUserRecord,
): Promise<UserRecord> => {
  const result = await db
    .insert(User)
    .values(userData)
    .onConflictDoUpdate({
      target: [User.email],
      set: { ...userData },
    })
    .returning();
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

  const result = await db
    .update(User)
    .set(updateData)
    .where(eq(User.id, userId))
    .returning();

  return result.length > 0 ? (result[0] as UserRecord) : null;
}

/**
 * Deletes a user by ID
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const result = await db.delete(User).where(eq(User.id, userId));
    return result.rowsAffected > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

/**
 * Gets the total number of users
 */
export async function getTotalUsers(): Promise<number> {
  const result = await db.select({ count: count() }).from(User);
  return result[0]?.count || 0;
}

/**
 * Searches users by name (case-insensitive partial match)
 */
export async function searchUsersByName(
  searchTerm: string,
): Promise<UserRecord[]> {
  const result = await db
    .select()
    .from(User)
    .where(like(User.name, `%${searchTerm}%`));
  return result;
}

/**
 * Gets recently created users (last N users)
 */
export async function getRecentUsers(limit = 10): Promise<UserRecord[]> {
  const result = await db
    .select()
    .from(User)
    .orderBy(User.createdAt)
    .limit(limit);
  return result;
}

/**
 * Clears all users from the database (use with caution!)
 */
export async function clearAllUsers(): Promise<boolean> {
  try {
    await db.delete(User);
    return true;
  } catch (error) {
    console.error('Error clearing users:', error);
    return false;
  }
}
