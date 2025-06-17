import crypto from 'node:crypto';

/**
 * Helper function to create a hash of the password using SHA-256
 * @param password - The plain text password to hash
 * @returns The hexadecimal string representation of the hash
 */
export function createHash(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify if a plain text password matches a hashed password
 * @param password - The plain text password to verify
 * @param hashedPassword - The stored hash to compare against
 * @returns True if the password matches the hash
 */
export function verifyPassword(
  password: string,
  hashedPassword: string,
): boolean {
  return createHash(password) === hashedPassword;
}
