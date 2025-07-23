import type { EventParticipantsName } from './participants';

export interface Combat {
  id: number;
  fighter1: EventParticipantsName;
  fighter2: EventParticipantsName;
  winner?: EventParticipantsName;
  year?: string;
}

export const laVeladaCombats: Combat[] = [
  {
    id: 1,
    fighter1: 'peereira',
    fighter2: 'rivaldios',
    year: '2025',
  },
  {
    id: 2,
    fighter1: 'perxitaa',
    fighter2: 'gaspi',
  },
  {
    id: 3,
    fighter1: 'abby',
    fighter2: 'roro',
  },
  {
    id: 4,
    fighter1: 'andoni',
    fighter2: 'carlos',
  },
  {
    id: 5,
    fighter1: 'alana',
    fighter2: 'arigeli',
  },
  {
    id: 6,
    fighter1: 'viruzz',
    fighter2: 'tomas',
  },
  {
    id: 7,
    fighter1: 'grefg',
    fighter2: 'westcol',
  },
];

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
 * Get all scheduled combats
 */
export function getScheduledCombats(): Combat[] {
  return laVeladaCombats.filter((combat) => combat.winner == null);
}

/**
 * Get all finished combats
 */
export function getFinishedCombats(): Combat[] {
  return laVeladaCombats.filter((combat) => combat.winner != null);
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
 * Update combat result
 */
export function updateCombatResult(combatId: number, winner: string): boolean {
  const combat = getCombatById(combatId);
  if (!combat) return false;

  // Validate that winner is one of the fighters
  if (winner !== combat.fighter1 && winner !== combat.fighter2) {
    return false;
  }

  combat.winner = winner;
  return true;
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
