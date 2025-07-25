import * as winnerRepository from './db/winner-repository';
import type { CombatWinnerRecord } from './db/winner-repository';

/**
 * Gets all combat winners
 */
export async function getAllWinners(): Promise<CombatWinnerRecord[]> {
  return await winnerRepository.getAllCombatWinners();
}

/**
 * Gets the winner for a specific combat
 */
export async function getWinnerByCombat(
  combatId: number,
): Promise<CombatWinnerRecord | null> {
  return await winnerRepository.getCombatWinner(combatId);
}

/**
 * Delete all combat winners
 */
export async function clearAllWinners(): Promise<boolean> {
  return await winnerRepository.clearAllCombatWinners();
}
