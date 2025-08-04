/**
 * Backend Validation Library
 *
 * Provides server-side validation utilities for API routes
 * Re-exports validation schemas from utils and adds server-specific validation
 */

import { z } from 'zod';
import { ValidationUtils } from '../utils/validation';

/**
 * Generic input validation function for API routes
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        errors: result.error.errors.map(err => err.message)
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

/**
 * API-specific validation schemas
 */
export const apiSchemas = {
  // Re-export common schemas from utils
  ...ValidationUtils.schemas,

  // API-specific schemas
  organizationId: z.string().uuid('Invalid organization ID'),
  frameworkId: z.string().uuid('Invalid framework ID').optional(),
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  }),
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20)
  }),
  auditTrail: z.object({
    action: z.string().min(1),
    resource: z.string().min(1),
    details: z.record(z.any()).optional()
  })
};

/**
 * Validation middleware helper
 * Creates Express middleware for request validation
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    const result = validateInput(schema, req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.errors
      });
    }

    req.validatedData = result.data;
    next();
  };
}

export default {
  validateInput,
  schemas: apiSchemas,
  createValidationMiddleware
};
