import crypto from 'node:crypto';

/**
 * Generate a random salt for password hashing
 * @returns A random salt string
 */
export function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a password with a salt using PBKDF2
 * @param password - The plain text password to hash
 * @param salt - The salt to use for hashing
 * @returns The hexadecimal string representation of the hash
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

/**
 * Verify if a plain text password matches a hashed password
 * @param password - The plain text password to verify
 * @param hashedPassword - The stored hash to compare against
 * @param salt - The salt used for the stored hash
 * @returns True if the password matches the hash
 */
export function verifyPassword(
  password: string,
  hashedPassword: string,
  salt: string,
): boolean {
  const hash = hashPassword(password, salt);
  return hash === hashedPassword;
}

/**
 * Generates a random UUID
 * @returns A random UUID string
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
