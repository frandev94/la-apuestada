import { describe, expect, it } from 'vitest';
import { generateSalt, hashPassword, verifyPassword } from './crypto';

describe('Auth Utils', () => {
  const salt = generateSalt();
  describe('hashPassword', () => {
    it('should create a consistent hash for the same password', () => {
      const password = 'mySecurePassword123';
      const hash1 = hashPassword(password, salt);
      const hash2 = hashPassword(password, salt);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(128); // PBKDF2-SHA512 produces 128-character hex string
    });

    it('should create different hashes for different passwords', () => {
      const password1 = 'password1';
      const password2 = 'password2';
      const hash1 = hashPassword(password1, salt);
      const hash2 = hashPassword(password2, salt);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = hashPassword('', salt);

      expect(hash).toHaveLength(128);
      expect(typeof hash).toBe('string');
    });

    it('should handle special characters', () => {
      const password = 'pàssw@rd!#$%&*()_+{}[]|;:,.<>?';
      const hash = hashPassword(password, salt);

      expect(hash).toHaveLength(128);
      expect(typeof hash).toBe('string');
    });

    it('should handle unicode characters', () => {
      const password = 'пароль密码🔐';
      const hash = hashPassword(password, salt);

      expect(hash).toHaveLength(128);
      expect(typeof hash).toBe('string');
    });

    it('should be case sensitive', () => {
      const hash1 = hashPassword('Password', salt);
      const hash2 = hashPassword('password', salt);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for matching password and hash', () => {
      const password = 'mySecurePassword123';
      const hash = hashPassword(password, salt);
      const isValid = verifyPassword(password, hash, salt);

      expect(isValid).toBe(true);
    });

    it('should return false for non-matching password and hash', () => {
      const password = 'mySecurePassword123';
      const wrongPassword = 'wrongPassword';
      const hash = hashPassword(password, salt);
      const isValid = verifyPassword(wrongPassword, hash, salt);

      expect(isValid).toBe(false);
    });

    it('should return false for empty password against real hash', () => {
      const password = 'mySecurePassword123';
      const hash = hashPassword(password, salt);
      const isValid = verifyPassword('', hash, salt);

      expect(isValid).toBe(false);
    });

    it('should return true for empty password against empty hash', () => {
      const emptyHash = hashPassword('', salt);
      const isValid = verifyPassword('', emptyHash, salt);

      expect(isValid).toBe(true);
    });

    it('should handle special characters in verification', () => {
      const password = 'pàssw@rd!#$%&*()_+{}[]|;:,.<>?';
      const hash = hashPassword(password, salt);
      const isValid = verifyPassword(password, hash, salt);

      expect(isValid).toBe(true);
    });

    it('should handle unicode characters in verification', () => {
      const password = 'пароль密码🔐';
      const hash = hashPassword(password, salt);
      const isValid = verifyPassword(password, hash, salt);

      expect(isValid).toBe(true);
    });

    it('should be case sensitive in verification', () => {
      const password = 'Password';
      const hash = hashPassword(password, salt);
      const isValid1 = verifyPassword('Password', hash, salt);
      const isValid2 = verifyPassword('password', hash, salt);

      expect(isValid1).toBe(true);
      expect(isValid2).toBe(false);
    });

    it('should handle invalid/malformed hash', () => {
      const password = 'myPassword';
      const invalidHash = 'not-a-valid-hash';
      const isValid = verifyPassword(password, invalidHash, salt);

      expect(isValid).toBe(false);
    });
  });

  describe('Integration tests', () => {
    it('should work with real-world password scenarios', () => {
      const passwords = [
        '123456',
        'password',
        'qwerty',
        'admin',
        'letmein',
        'welcome',
        'monkey',
        'dragon',
        'master',
        'sunshine',
        'SuperSecure123!@#',
        'MyVeryLongPasswordWithNumbers123AndSymbols!@#$',
      ];

      for (const password of passwords) {
        const hash = hashPassword(password, salt);
        const isValid = verifyPassword(password, hash, salt);

        expect(isValid).toBe(true);
        expect(hash).toHaveLength(128);

        // Test with wrong password
        const wrongPassword = `wrong_${password}`;
        const isInvalid = verifyPassword(wrongPassword, hash, salt);
        expect(isInvalid).toBe(false);
      }
    });

    it('should maintain consistency across multiple operations', () => {
      const password = 'consistencyTest123';

      // Create multiple hashes of the same password
      const hashes = Array.from({ length: 10 }, () =>
        hashPassword(password, salt),
      );

      // All hashes should be identical
      const firstHash = hashes[0];
      for (const hash of hashes) {
        expect(hash).toBe(firstHash);
      }

      // All should verify correctly
      for (const hash of hashes) {
        expect(verifyPassword(password, hash, salt)).toBe(true);
      }
    });
  });
});
