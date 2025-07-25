import type { Combat } from '@/constants/combats';

/**
 * Test fixtures for combats-related components and functionality
 * Centralized test data management for consistent testing
 */

export const mockCombats: Combat[] = [
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
    winner: 'gaspi',
    year: '2025',
  },
  {
    id: 3,
    fighter1: 'abby',
    fighter2: 'roro',
    year: '2025',
  },
  {
    id: 4,
    fighter1: 'tomas',
    fighter2: 'viruzz',
    winner: 'tomas',
    year: '2025',
  },
  {
    id: 5,
    fighter1: 'grefg',
    fighter2: 'westcol',
    year: '2025',
  },
];

export const mockOpponentMappings: Record<string, string> = {
  peereira: 'rivaldios',
  rivaldios: 'peereira',
  perxitaa: 'gaspi',
  gaspi: 'perxitaa',
  abby: 'roro',
  roro: 'abby',
  coscu: 'viruzz',
  viruzz: 'coscu',
  fernanfloo: 'spreen',
  spreen: 'fernanfloo',
};

export const combatScenarios = {
  scheduled: mockCombats.filter((combat) => combat.winner == null),
  finished: mockCombats.filter((combat) => combat.winner != null),
  allCombats: mockCombats,
} as const;
