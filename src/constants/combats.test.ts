import { describe, expect, test } from 'vitest';
import {
  getCombatById,
  getCombatsByFighter,
  getOpponent,
  getTotalCombats,
  laVeladaCombats,
  validateCombats,
} from './combats';

describe('Combats Module', () => {
  test('basic import test', () => {
    expect(laVeladaCombats).toBeDefined();
    expect(getCombatById).toBeDefined();
    expect(getCombatsByFighter).toBeDefined();
    expect(getOpponent).toBeDefined();
    expect(getTotalCombats).toBeDefined();
    expect(validateCombats).toBeDefined();
  });

  describe('laVeladaCombats', () => {
    test('should contain correct number of combats', () => {
      expect(laVeladaCombats.length).toBeGreaterThan(0);
    });

    test('should match the published 2026 combat lineup', () => {
      expect(laVeladaCombats).toEqual([
        {
          id: 1,
          fighter1: 'laparce',
          fighter2: 'fabianasevillano',
          year: '2026',
        },
        { id: 2, fighter1: 'clersss', fighter2: 'nataliamx', year: '2026' },
        { id: 3, fighter1: 'eduaguirre', fighter2: 'gastonedul', year: '2026' },
        { id: 4, fighter1: 'martadiaz', fighter2: 'tatianakaer', year: '2026' },
        { id: 5, fighter1: 'viruzz', fighter2: 'geroarias', year: '2026' },
        {
          id: 6,
          fighter1: 'alondrissa',
          fighter2: 'angievelasco',
          year: '2026',
        },
        { id: 7, fighter1: 'litkillah', fighter2: 'kiddkeo', year: '2026' },
        { id: 8, fighter1: 'samyrivers', fighter2: 'roro', year: '2026' },
        { id: 9, fighter1: 'plex', fighter2: 'fernanfloo', year: '2026' },
        { id: 10, fighter1: 'illojuan', fighter2: 'thegrefg', year: '2026' },
      ]);
    });

    test('should have unique combat IDs', () => {
      const ids = laVeladaCombats.map((combat) => combat.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have sequential IDs starting from 1', () => {
      const ids = laVeladaCombats
        .map((combat) => combat.id)
        .sort((a, b) => a - b);
      expect(ids[0]).toBe(1);
      expect(ids[ids.length - 1]).toBe(laVeladaCombats.length);
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
      expect(typeof combat?.fighter1).toBe('string');
      expect(typeof combat?.fighter2).toBe('string');
    });

    test('should return undefined for invalid ID', () => {
      expect(getCombatById(99)).toBeUndefined();
      expect(getCombatById(0)).toBeUndefined();
      expect(getCombatById(-1)).toBeUndefined();
    });
  });

  describe('getCombatsByFighter', () => {
    test('should return combat for valid fighter', () => {
      const firstCombat = laVeladaCombats[0];
      const combats = getCombatsByFighter(firstCombat.fighter1);
      expect(combats).toHaveLength(1);
      expect(combats[0].id).toBe(firstCombat.id);
    });

    test('should return combat whether fighter is fighter1 or fighter2', () => {
      const firstCombat = laVeladaCombats[0];
      const combat1 = getCombatsByFighter(firstCombat.fighter1);
      const combat2 = getCombatsByFighter(firstCombat.fighter2);

      expect(combat1).toHaveLength(1);
      expect(combat2).toHaveLength(1);
      expect(combat1[0].id).toBe(combat2[0].id);
    });

    test('should return empty array for invalid fighter', () => {
      const combats = getCombatsByFighter('nonexistent');
      expect(combats).toHaveLength(0);
    });
  });

  describe('getOpponent', () => {
    test('should return correct opponent for fighter1', () => {
      const firstCombat = laVeladaCombats[0];
      const opponent = getOpponent(firstCombat.fighter1);
      expect(opponent).toBe(firstCombat.fighter2);
    });

    test('should return correct opponent for fighter2', () => {
      const firstCombat = laVeladaCombats[0];
      const opponent = getOpponent(firstCombat.fighter2);
      expect(opponent).toBe(firstCombat.fighter1);
    });

    test('should return null for non-existent fighter', () => {
      const opponent = getOpponent('nonexistent');
      expect(opponent).toBeNull();
    });
  });

  describe('getTotalCombats', () => {
    test('should return correct total number of combats', () => {
      expect(getTotalCombats()).toBe(laVeladaCombats.length);
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
