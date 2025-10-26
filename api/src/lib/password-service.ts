/**
 * Password Service using scrypt
 *
 * Provides secure password hashing and verification using scrypt algorithm
 * from @noble/hashes library. Supports migration from legacy SHA-256 hashes.
 */

import { scrypt } from '@noble/hashes/scrypt.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

export class PasswordService {
  // scrypt parameters (N=2^16, r=8, p=1 - balanced security/performance for edge)
  private static readonly SCRYPT_N = 65536; // 2^16 iterations
  private static readonly SCRYPT_R = 8;
  private static readonly SCRYPT_P = 1;
  private static readonly HASH_LENGTH = 32;

  /**
   * Hash a password using scrypt
   *
   * @param password - Plain text password
   * @returns Hashed password in format: algorithm$salt$hash
   *
   * @example
   * const hash = await PasswordService.hash("MyP@ssw0rd!");
   * // Returns: "scrypt$a1b2c3d4...$e5f6g7h8..."
   */
  static async hash(password: string): Promise<string> {
    try {
      // Generate random salt (16 bytes = 128 bits)
      const salt = crypto.getRandomValues(new Uint8Array(16));

      // Hash password with scrypt
      const hash = scrypt(password, salt, {
        N: this.SCRYPT_N,
        r: this.SCRYPT_R,
        p: this.SCRYPT_P,
        dkLen: this.HASH_LENGTH,
      });

      // Return in format: algorithm$salt$hash
      const saltHex = bytesToHex(salt);
      const hashHex = bytesToHex(hash);
      return `scrypt$${saltHex}$${hashHex}`;
    } catch (error) {
      console.error('[PasswordService] Hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify password against stored hash
   *
   * Supports both:
   * - New scrypt hashes (format: scrypt$salt$hash)
   * - Legacy SHA-256 hashes (for backward compatibility)
   *
   * @param password - Plain text password to verify
   * @param storedHash - Stored password hash
   * @returns True if password matches, false otherwise
   */
  static async verify(password: string, storedHash: string): Promise<boolean> {
    try {
      // Check hash format
      if (storedHash.startsWith('scrypt$')) {
        return await this.verifyScrypt(password, storedHash);
      } else {
        // Legacy SHA-256 hash (for backward compatibility)
        return await this.verifySHA256(password, storedHash);
      }
    } catch (error) {
      console.error('[PasswordService] Verification error:', error);
      return false;
    }
  }

  /**
   * Check if a hash needs migration from legacy format
   *
   * @param storedHash - Stored password hash
   * @returns True if hash should be migrated to scrypt
   */
  static needsMigration(storedHash: string): boolean {
    return !storedHash.startsWith('scrypt$');
  }

  /**
   * Verify password against scrypt hash
   */
  private static async verifyScrypt(
    password: string,
    storedHash: string
  ): Promise<boolean> {
    try {
      // Parse stored hash: algorithm$salt$hash
      const parts = storedHash.split('$');
      if (parts.length !== 3 || parts[0] !== 'scrypt') {
        console.warn('[PasswordService] Invalid scrypt hash format');
        return false;
      }

      const salt = hexToBytes(parts[1]);
      const expectedHash = hexToBytes(parts[2]);

      // Hash the provided password with the same salt
      const actualHash = scrypt(password, salt, {
        N: this.SCRYPT_N,
        r: this.SCRYPT_R,
        p: this.SCRYPT_P,
        dkLen: this.HASH_LENGTH,
      });

      // Constant-time comparison to prevent timing attacks
      if (actualHash.length !== expectedHash.length) {
        return false;
      }

      let result = 0;
      for (let i = 0; i < actualHash.length; i++) {
        result |= actualHash[i] ^ expectedHash[i];
      }

      return result === 0;
    } catch (error) {
      console.error('[PasswordService] Scrypt verification error:', error);
      return false;
    }
  }

  /**
   * Verify password against legacy SHA-256 hash
   *
   * Used for backward compatibility with existing user passwords.
   * Passwords should be migrated to scrypt on successful login.
   */
  private static async verifySHA256(
    password: string,
    storedHash: string
  ): Promise<boolean> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      return passwordHash === storedHash;
    } catch (error) {
      console.error('[PasswordService] SHA-256 verification error:', error);
      return false;
    }
  }

  /**
   * Validate password complexity requirements
   *
   * Requirements:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   *
   * @param password - Password to validate
   * @returns Object with validation result and error messages
   */
  static validateComplexity(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate a secure random password
   *
   * @param length - Password length (minimum 12)
   * @returns Generated password
   */
  static generateSecurePassword(length: number = 16): string {
    if (length < 12) {
      throw new Error('Password length must be at least 12 characters');
    }

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = uppercase + lowercase + numbers + special;

    // Ensure at least one character from each category
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * all.length);
      password += all[randomIndex];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
