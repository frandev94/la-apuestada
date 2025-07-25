import { CombatWinner, db, eq } from 'astro:db';
import type { EventParticipantsName } from '../../constants/participants';

export type CombatWinnerInput = typeof CombatWinner.$inferInsert & {
  combatId: number; // The combat this winner is for
  winner: EventParticipantsName; // The participant who won the combat
};

export type CombatWinnerRecord = typeof CombatWinner.$inferSelect & {
  winner: EventParticipantsName; // The participant who won the combat
};

/**
 * Creates or updates the winner for a combat
 */
export async function upsertCombatWinner(
  input: CombatWinnerInput,
): Promise<CombatWinnerRecord> {
  // Insert the new winner
  const result = await db
    .insert(CombatWinner)
    .values({ ...input })
    // or update if it already exists
    .onConflictDoUpdate({
      target: [CombatWinner.combatId],
      set: { ...input },
    })
    .returning();
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
  const result = await db
    .select()
    .from(CombatWinner)
    .where(eq(CombatWinner.combatId, combatId))
    .limit(1);
  return result.length > 0 ? (result[0] as CombatWinnerRecord) : null;
}

/**
 * Gets all combat winners
 */
export async function getAllCombatWinners(): Promise<CombatWinnerRecord[]> {
  const result = await db.select().from(CombatWinner);
  return result as CombatWinnerRecord[];
}

/**
 * Deletes the winner for a combat
 */
export async function deleteCombatWinner(combatId: number): Promise<boolean> {
  try {
    await db.delete(CombatWinner).where(eq(CombatWinner.combatId, combatId));
    return true;
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
    await db.delete(CombatWinner);
    return true;
  } catch (error) {
    console.error('Error clearing combat winners:', error);
    return false;
  }
}
