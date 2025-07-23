import { describe, expect, test } from 'vitest';
import {
  getCombatById,
  getCombatsByFighter,
  getFinishedCombats,
  getOpponent,
  getScheduledCombats,
  getTotalCombats,
  laVeladaCombats,
  updateCombatResult,
  validateCombats,
} from './combats';

describe('Combats Module', () => {
  test('basic import test', () => {
    expect(laVeladaCombats).toBeDefined();
    expect(getCombatById).toBeDefined();
    expect(getCombatsByFighter).toBeDefined();
    expect(getScheduledCombats).toBeDefined();
    expect(getFinishedCombats).toBeDefined();
    expect(getOpponent).toBeDefined();
    expect(updateCombatResult).toBeDefined();
    expect(getTotalCombats).toBeDefined();
    expect(validateCombats).toBeDefined();
  });

  describe('laVeladaCombats', () => {
    test('should contain 7 combats', () => {
      expect(laVeladaCombats).toHaveLength(7);
    });

    test('should have all expected combats', () => {
      const expectedCombats = [
        { id: 1, fighter1: 'peereira', fighter2: 'rivaldios' },
        { id: 2, fighter1: 'perxitaa', fighter2: 'gaspi' },
        { id: 3, fighter1: 'abby', fighter2: 'roro' },
        { id: 4, fighter1: 'andoni', fighter2: 'carlos' },
        { id: 5, fighter1: 'alana', fighter2: 'arigeli' },
        { id: 6, fighter1: 'viruzz', fighter2: 'tomas' },
        { id: 7, fighter1: 'grefg', fighter2: 'westcol' },
      ];

      for (const expected of expectedCombats) {
        const combat = getCombatById(expected.id);
        expect(combat).toBeDefined();
        expect(combat?.fighter1).toBe(expected.fighter1);
        expect(combat?.fighter2).toBe(expected.fighter2);
      }
    });

    test('should have unique combat IDs', () => {
      const ids = laVeladaCombats.map((combat) => combat.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have sequential IDs from 1 to 7', () => {
      const ids = laVeladaCombats
        .map((combat) => combat.id)
        .sort((a, b) => a - b);
      expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    test('each fighter should appear exactly once', () => {
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

      for (const count of Object.values(fighterCounts)) {
        expect(count).toBe(1);
      }
    });
  });

  describe('getCombatById', () => {
    test('should return combat for valid ID', () => {
      const combat = getCombatById(1);
      expect(combat).toBeDefined();
      expect(combat?.id).toBe(1);
      expect(combat?.fighter1).toBe('peereira');
      expect(combat?.fighter2).toBe('rivaldios');
    });

    test('should return undefined for invalid ID', () => {
      expect(getCombatById(99)).toBeUndefined();
      expect(getCombatById(0)).toBeUndefined();
      expect(getCombatById(-1)).toBeUndefined();
    });
  });

  describe('getCombatsByFighter', () => {
    test('should return combat for valid fighter', () => {
      const combats = getCombatsByFighter('peereira');
      expect(combats).toHaveLength(1);
      expect(combats[0].id).toBe(1);
    });

    test('should return combat whether fighter is fighter1 or fighter2', () => {
      const combat1 = getCombatsByFighter('peereira'); // fighter1
      const combat2 = getCombatsByFighter('rivaldios'); // fighter2

      expect(combat1).toHaveLength(1);
      expect(combat2).toHaveLength(1);
      expect(combat1[0].id).toBe(combat2[0].id);
    });

    test('should return empty array for invalid fighter', () => {
      const combats = getCombatsByFighter('nonexistent');
      expect(combats).toHaveLength(0);
    });
  });

  describe('getScheduledCombats', () => {
    test('should return all combats initially', () => {
      const scheduled = getScheduledCombats();
      expect(scheduled).toHaveLength(7);
    });

    test('should return only scheduled combats', () => {
      const scheduled = getScheduledCombats();
      for (const combat of scheduled) {
        expect(combat.winner).toBeUndefined();
      }
    });
  });

  describe('getFinishedCombats', () => {
    test('should return empty array initially', () => {
      const finished = getFinishedCombats();
      expect(finished).toHaveLength(0);
    });
  });

  describe('getOpponent', () => {
    test('should return correct opponent for fighter1', () => {
      const opponent = getOpponent('peereira');
      expect(opponent).toBe('rivaldios');
    });

    test('should return correct opponent for fighter2', () => {
      const opponent = getOpponent('rivaldios');
      expect(opponent).toBe('peereira');
    });

    test('should return null for non-existent fighter', () => {
      const opponent = getOpponent('nonexistent');
      expect(opponent).toBeNull();
    });
  });

  describe('updateCombatResult', () => {
    test('should update combat result successfully', () => {
      const success = updateCombatResult(1, 'peereira');
      expect(success).toBe(true);

      const combat = getCombatById(1);
      expect(combat?.winner).toBe('peereira');
    });

    test('should fail for invalid combat ID', () => {
      const success = updateCombatResult(99, 'peereira');
      expect(success).toBe(false);
    });

    test('should fail for invalid winner', () => {
      const success = updateCombatResult(2, 'invalid_fighter');
      expect(success).toBe(false);
    });

    test('should update finished combats count', () => {
      // Reset combat 1 to scheduled for this test
      const combat1 = getCombatById(1);
      if (combat1) {
        combat1.winner = undefined;
      }

      const initialFinished = getFinishedCombats().length;
      updateCombatResult(1, 'peereira');
      const afterFinished = getFinishedCombats().length;

      expect(afterFinished).toBe(initialFinished + 1);
    });
  });

  describe('getTotalCombats', () => {
    test('should return correct total number of combats', () => {
      expect(getTotalCombats()).toBe(7);
    });
  });

  describe('validateCombats', () => {
    test('should validate correct combat structure', () => {
      const validation = validateCombats();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should detect validation issues if they exist', () => {
      // This test assumes the current data is valid
      // In a real scenario, you might want to test with invalid data
      const validation = validateCombats();
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('errors');
      expect(Array.isArray(validation.errors)).toBe(true);
    });
  });

  describe('Combat interface', () => {
    test('should have correct structure', () => {
      const combat = getCombatById(1);
      expect(combat).toHaveProperty('id');
      expect(combat).toHaveProperty('fighter1');
      expect(combat).toHaveProperty('fighter2');
      expect(typeof combat?.id).toBe('number');
      expect(typeof combat?.fighter1).toBe('string');
      expect(typeof combat?.fighter2).toBe('string');
    });
  });
});
