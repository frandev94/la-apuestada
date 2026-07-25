import { activeConfig } from '@/config';
import { normalizeFighterName } from './participants';

export interface Combat {
  id: number;
  fighter1: string;
  fighter2: string;
  year: string;
}

export const laVeladaCombats: Combat[] = activeConfig.combats.map((c) => ({
  id: c.pelea,
  fighter1: normalizeFighterName(c.fighter_1),
  fighter2: normalizeFighterName(c.fighter_2),
  year: String(activeConfig.year),
}));

/**
 * Get a combat by ID
 */
export function getCombatById(id: number): Combat | undefined {
  return laVeladaCombats.find((combat) => combat.id === id);
}

/**
 * Get combats by fighter name
 */
export function getCombatsByFighter(fighterName: string): Combat[] {
  return laVeladaCombats.filter(
    (combat) =>
      combat.fighter1 === fighterName || combat.fighter2 === fighterName,
  );
}

/**
 * Get the opponent of a given fighter in their combat
 */
export function getOpponent(fighterName: string): string | null {
  const combat = getCombatsByFighter(fighterName)[0];
  if (!combat) return null;

  return combat.fighter1 === fighterName ? combat.fighter2 : combat.fighter1;
}

/**
 * Get total number of combats
 */
export function getTotalCombats(): number {
  return laVeladaCombats.length;
}

/**
 * Validate combat data structure
 */
export function validateCombats(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for duplicate IDs
  const ids = laVeladaCombats.map((combat) => combat.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push('Duplicate combat IDs found');
  }

  // Check for duplicate fighter pairings
  const pairings = laVeladaCombats.map((combat) =>
    [combat.fighter1, combat.fighter2].sort().join('-'),
  );
  const uniquePairings = new Set(pairings);
  if (pairings.length !== uniquePairings.size) {
    errors.push('Duplicate fighter pairings found');
  }

  // Check that each fighter appears in exactly one combat
  const allFighters: string[] = [];
  for (const combat of laVeladaCombats) {
    allFighters.push(combat.fighter1, combat.fighter2);
  }

  const fighterCounts = allFighters.reduce(
    (acc, fighter) => {
      acc[fighter] = (acc[fighter] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  for (const [fighter, count] of Object.entries(fighterCounts)) {
    if (count > 1) {
      errors.push(`Fighter ${fighter} appears in multiple combats`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
