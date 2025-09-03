/**
 * Security Utilities
 * Provides security-related functionality for the application
 * Implements best practices for web application security
 */

import CryptoJS from 'crypto-js';
import { TIME_CONSTANTS, SECURITY_CONSTANTS } from './constants';
import { log } from './logger';

/**
 * Security configuration object
 * Contains settings for various security features
 */
export const SECURITY_CONFIG = {
  // Token settings
  token: {
    expiryTime: TIME_CONSTANTS.HOUR_IN_MS, // 1 hour in milliseconds
    refreshExpiryTime: TIME_CONSTANTS.WEEK_IN_MS, // 7 days in milliseconds
    storagePrefix: 'synapse_' // Prefix for all storage keys
  },
  // Password settings
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true
  },
  // CSRF protection
  csrf: {
    headerName: 'X-CSRF-Token',
    cookieName: 'synapse-csrf-token'
  },
  // Content Security Policy settings
  csp: {
    enabled: true,
    reportOnly: false
  }
};

/**
 * Securely stores data in localStorage with encryption
 * @param key - Storage key
 * @param value - Value to store
 * @param encryptionKey - Optional custom encryption key
 */
/**
 * Type for values that can be securely stored
 */
type StorableValue = string | number | boolean | object | null;

export const secureStore = {
  set: (key: string, value: StorableValue, encryptionKey?: string): void => {
    try {
      const prefixedKey = `${SECURITY_CONFIG.token.storagePrefix}${key}`;
      const valueToStore = JSON.stringify(value);
      const secretKey = encryptionKey || getEncryptionKey();
      const encryptedValue = CryptoJS.AES.encrypt(valueToStore, secretKey).toString();
      localStorage.setItem(prefixedKey, encryptedValue);
    } catch (error) {
      log.error('Error storing encrypted data', { error, key }, 'SecureStore');
    }
  },

  /**
   * Retrieves and decrypts data from localStorage
   * @param key - Storage key
   * @param encryptionKey - Optional custom encryption key
   * @returns The decrypted value or null if not found/error
   */
  get: <T>(key: string, encryptionKey?: string): T | null => {
    try {
      const prefixedKey = `${SECURITY_CONFIG.token.storagePrefix}${key}`;
      const encryptedValue = localStorage.getItem(prefixedKey);

      if (!encryptedValue) {
        return null;
      }

      const secretKey = encryptionKey || getEncryptionKey();
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedValue) as T;
    } catch (error) {
      log.error('Error retrieving encrypted data', { error, key }, 'SecureStore');
      return null;
    }
  },

  /**
   * Removes data from localStorage
   * @param key - Storage key
   */
  remove: (key: string): void => {
    try {
      const prefixedKey = `${SECURITY_CONFIG.token.storagePrefix}${key}`;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      log.error('Error removing data', { error, key }, 'SecureStore');
    }
  },

  /**
   * Clears all application data from localStorage
   */
  clear: (): void => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(SECURITY_CONFIG.token.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      log.error('Error clearing data', { error }, 'SecureStore');
    }
  }
};

/**
 * Generates a CSRF token for form submissions
 * @returns A new CSRF token
 */
export const generateCsrfToken = (): string => {
  const token = CryptoJS.lib.WordArray.random(SECURITY_CONSTANTS.TOKEN.RANDOM_BYTES).toString();
  secureStore.set('csrfToken', token);
  return token;
};

/**
 * Validates a CSRF token against the stored token
 * @param token - The token to validate
 * @returns Whether the token is valid
 */
export const validateCsrfToken = (token: string): boolean => {
  const storedToken = secureStore.get<string>('csrfToken');
  return storedToken === token;
};

/**
 * Validates password strength based on security configuration
 * @param password - The password to validate
 * @returns Object containing validation result and any error messages
 */
export const validatePasswordStrength = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = SECURITY_CONFIG.password;

  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters long`);
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (config.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (config.requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The input to sanitize
 * @returns Sanitized input string
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Gets or generates an encryption key for secure storage
 * Uses a combination of device information and user session
 * @returns An encryption key
 */
const getEncryptionKey = (): string => {
  // In a real application, this would use more sophisticated methods
  // For demo purposes, we're using a simple approach with localStorage directly
  const keyName = `${SECURITY_CONFIG.token.storagePrefix}encryptionKey`;
  let key = localStorage.getItem(keyName);

  if (!key) {
    // Generate a new key
    key = CryptoJS.lib.WordArray.random(SECURITY_CONSTANTS.ENCRYPTION.KEY_LENGTH).toString();
    localStorage.setItem(keyName, key);
  }

  return key;
};

/**
 * Generates a secure random token
 * @param length - Length of the token
 * @returns A random token string
 */
export const generateSecureToken = (length = SECURITY_CONSTANTS.TOKEN.DEFAULT_LENGTH): string => {
  return CryptoJS.lib.WordArray.random(length / 2).toString();
};

/**
 * Checks if the current session token is expired
 * @param token - The token object with expiry information
 * @returns Whether the token is expired
 */
export const isTokenExpired = (token: { expiresAt?: number }): boolean => {
  if (!token.expiresAt) {
    return true;
  }
  return Date.now() > token.expiresAt;
};

/**
 * Security utility object that provides various security functions
 */
export const SecurityUtils = {
  config: SECURITY_CONFIG,
  storage: secureStore,
  generateCsrfToken,
  validateCsrfToken,
  validatePasswordStrength,
  sanitizeInput,
  generateSecureToken,
  isTokenExpired
};

export default SecurityUtils;
