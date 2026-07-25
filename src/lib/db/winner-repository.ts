import { eq } from 'drizzle-orm';
import { db } from './client';
import { combatWinnersTable } from './schema';

export type CombatWinnerInput = typeof combatWinnersTable.$inferInsert & {
  combatId: number;
  winner: string;
};

export type CombatWinnerRecord = typeof combatWinnersTable.$inferSelect & {
  winner: string;
};

/**
 * Creates or updates the winner for a combat
 */
export async function upsertCombatWinner(
  input: CombatWinnerInput,
): Promise<CombatWinnerRecord> {
  const result = (await db
    .insert(combatWinnersTable)
    .values({ ...input })
    .onConflictDoUpdate({
      target: combatWinnersTable.combatId,
      set: { ...input },
    })
    .returning()) as CombatWinnerRecord[];
  if (!result[0]) {
    throw new Error(
      'Failed to upsert combat winner: No result returned from database.',
    );
  }
  return result[0] as CombatWinnerRecord;
}

/**
 * Gets the winner for a combat
 */
export async function getCombatWinner(
  combatId: number,
): Promise<CombatWinnerRecord | null> {
  const result = (await db
    .select()
    .from(combatWinnersTable)
    .where(eq(combatWinnersTable.combatId, combatId))
    .limit(1)) as CombatWinnerRecord[];
  return result.length > 0 ? (result[0] as CombatWinnerRecord) : null;
}

/**
 * Gets all combat winners
 */
export async function getAllCombatWinners(): Promise<CombatWinnerRecord[]> {
  return (await db.select().from(combatWinnersTable)) as CombatWinnerRecord[];
}

/**
 * Deletes the winner for a combat
 */
export async function deleteCombatWinner(combatId: number): Promise<boolean> {
  try {
    const result = await db
      .delete(combatWinnersTable)
      .where(eq(combatWinnersTable.combatId, combatId));
    return Number(result.rowsAffected ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting combat winner:', error);
    return false;
  }
}

/**
 * Deletes all combat winners
 */
export async function clearAllCombatWinners(): Promise<boolean> {
  try {
    await db.delete(combatWinnersTable);
    return true;
  } catch (error) {
    console.error('Error clearing combat winners:', error);
    return false;
  }
}
