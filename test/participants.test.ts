import { describe, expect, test } from 'vitest';
import {
  laVeladaParticipants,
  validateParticipantsList,
} from '../src/data/participants.js';

describe('Participants Module', () => {
  test('basic import test', () => {
    expect(laVeladaParticipants).toBeDefined();
    expect(validateParticipantsList).toBeDefined();
  });

  describe('laVeladaParticipants', () => {
    test('should contain the expected participants', () => {
      const expectedParticipants = [
        'peereira',
        'rivaldios',
        'perxitaa',
        'gaspi',
        'abby',
        'roro',
        'andoni',
        'carlos',
        'alana',
        'arigeli',
        'viruzz',
        'tomas',
        'grefg',
        'westcol',
      ];

      expect(laVeladaParticipants).toEqual(expectedParticipants);
    });

    test('should have 14 participants', () => {
      expect(laVeladaParticipants).toHaveLength(14);
    });

    test('should contain only unique participants', () => {
      const uniqueParticipants = new Set(laVeladaParticipants);
      expect(uniqueParticipants.size).toBe(laVeladaParticipants.length);
    });
    test('should contain only string values', () => {
      for (const participant of laVeladaParticipants) {
        expect(typeof participant).toBe('string');
        expect(participant.length).toBeGreaterThan(0);
      }
    });
    test('should not contain empty strings', () => {
      for (const participant of laVeladaParticipants) {
        expect(participant.trim()).toBe(participant);
        expect(participant).not.toBe('');
      }
    });
  });

  describe('validateParticipantsList', () => {
    test('should return the same array when validation passes', () => {
      const participants = ['alice', 'bob', 'charlie'];
      const result = validateParticipantsList(participants, 3);

      expect(result).toEqual(participants);
      expect(result).toBe(participants); // Same reference
    });

    test('should validate participants with correct count', () => {
      const participants = ['player1', 'player2', 'player3'];

      expect(() => validateParticipantsList(participants, 3)).not.toThrow();
    });

    test('should throw error when participants list has duplicates', () => {
      const participantsWithDuplicates = ['alice', 'bob', 'alice', 'charlie'];

      expect(() =>
        validateParticipantsList(participantsWithDuplicates, 4),
      ).toThrowError('Duplicate entries found in participants list.');
    });

    test('should throw error when count does not match expected', () => {
      const participants = ['alice', 'bob'];

      expect(() => validateParticipantsList(participants, 3)).toThrowError(
        'Participants list length does not match the expected count of 3.',
      );
    });

    test('should throw error when count is less than expected', () => {
      const participants = ['alice'];

      expect(() => validateParticipantsList(participants, 5)).toThrowError(
        'Participants list length does not match the expected count of 5.',
      );
    });

    test('should throw error when count is more than expected', () => {
      const participants = ['alice', 'bob', 'charlie', 'david', 'eve'];

      expect(() => validateParticipantsList(participants, 3)).toThrowError(
        'Participants list length does not match the expected count of 3.',
      );
    });

    test('should handle empty array correctly', () => {
      const participants: string[] = [];

      expect(() => validateParticipantsList(participants, 0)).not.toThrow();
      expect(() => validateParticipantsList(participants, 1)).toThrowError(
        'Participants list length does not match the expected count of 1.',
      );
    });

    test('should handle single participant correctly', () => {
      const participants = ['solo'];

      expect(() => validateParticipantsList(participants, 1)).not.toThrow();
    });

    test('should detect duplicates regardless of order', () => {
      const participants = ['alice', 'bob', 'charlie', 'bob'];

      expect(() => validateParticipantsList(participants, 4)).toThrowError(
        'Duplicate entries found in participants list.',
      );
    });

    test('should be case sensitive for duplicates', () => {
      const participants = ['Alice', 'alice', 'Bob'];

      // Should not throw because 'Alice' and 'alice' are different
      expect(() => validateParticipantsList(participants, 3)).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    test('laVeladaParticipants should pass validation with correct count', () => {
      expect(() =>
        validateParticipantsList(laVeladaParticipants, 14),
      ).not.toThrow();
    });

    test('laVeladaParticipants should fail validation with wrong count', () => {
      expect(() =>
        validateParticipantsList(laVeladaParticipants, 10),
      ).toThrowError(
        'Participants list length does not match the expected count of 10.',
      );
    });

    test('laVeladaParticipants should have no duplicates', () => {
      expect(() =>
        validateParticipantsList(
          laVeladaParticipants,
          laVeladaParticipants.length,
        ),
      ).not.toThrow();
    });
  });
});
