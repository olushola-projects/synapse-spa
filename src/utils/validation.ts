/**
 * Validation Utilities
 *
 * Provides validation functions for forms and user inputs
 * Implements consistent validation rules across the application
 */

import { z } from 'zod';
import SecurityUtils from './security';
import { VALIDATION_CONSTANTS } from './constants';

/**
 * Email validation schema
 * Validates email format and common requirements
 */
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Invalid email address' });

/**
 * Password validation schema
 * Enforces password strength requirements
 */
export const passwordSchema = z
  .string()
  .min(SecurityUtils.config.password.minLength, {
    message: `Password must be at least ${SecurityUtils.config.password.minLength} characters`
  })
  .refine(
    password => (SecurityUtils.config.password.requireUppercase ? /[A-Z]/.test(password) : true),
    { message: 'Password must contain at least one uppercase letter' }
  )
  .refine(
    password => (SecurityUtils.config.password.requireLowercase ? /[a-z]/.test(password) : true),
    { message: 'Password must contain at least one lowercase letter' }
  )
  .refine(
    password => (SecurityUtils.config.password.requireNumber ? /[0-9]/.test(password) : true),
    { message: 'Password must contain at least one number' }
  )
  .refine(
    password =>
      SecurityUtils.config.password.requireSpecial ? /[^A-Za-z0-9]/.test(password) : true,
    { message: 'Password must contain at least one special character' }
  );

/**
 * Name validation schema
 * Validates user name format
 */
export const nameSchema = z
  .string()
  .min(VALIDATION_CONSTANTS.NAME.MIN_LENGTH, {
    message: `Name must be at least ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} characters`
  })
  .max(VALIDATION_CONSTANTS.NAME.MAX_LENGTH, {
    message: `Name must be less than ${VALIDATION_CONSTANTS.NAME.MAX_LENGTH} characters`
  })
  .refine(name => /^[a-zA-Z\s'-]+$/.test(name), {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
  });

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional()
});

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    terms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

/**
 * Profile form validation schema
 */
export const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  jurisdiction: z.string().min(1, { message: 'Jurisdiction is required' }),
  bio: z
    .string()
    .max(VALIDATION_CONSTANTS.BIO.MAX_LENGTH, {
      message: `Bio must be less than ${VALIDATION_CONSTANTS.BIO.MAX_LENGTH} characters`
    })
    .optional(),
  company: z
    .string()
    .max(VALIDATION_CONSTANTS.COMPANY.MAX_LENGTH, {
      message: `Company name must be less than ${VALIDATION_CONSTANTS.COMPANY.MAX_LENGTH} characters`
    })
    .optional(),
  position: z
    .string()
    .max(VALIDATION_CONSTANTS.POSITION.MAX_LENGTH, {
      message: `Position must be less than ${VALIDATION_CONSTANTS.POSITION.MAX_LENGTH} characters`
    })
    .optional()
});

/**
 * Password reset request validation schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema
});

/**
 * Password reset validation schema
 */
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(VALIDATION_CONSTANTS.CONTACT.SUBJECT_MIN_LENGTH, {
    message: `Subject must be at least ${VALIDATION_CONSTANTS.CONTACT.SUBJECT_MIN_LENGTH} characters`
  }),
  message: z.string().min(VALIDATION_CONSTANTS.CONTACT.MESSAGE_MIN_LENGTH, {
    message: `Message must be at least ${VALIDATION_CONSTANTS.CONTACT.MESSAGE_MIN_LENGTH} characters`
  })
});

/**
 * Validation utility object that provides various validation schemas
 */
export const ValidationUtils = {
  schemas: {
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    login: loginSchema,
    register: registerSchema,
    profile: profileSchema,
    passwordResetRequest: passwordResetRequestSchema,
    passwordReset: passwordResetSchema,
    contact: contactSchema
  }
};

export default ValidationUtils;
