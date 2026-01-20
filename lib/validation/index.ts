// ============================================
// VALIDATION SCHEMAS
// ============================================
// Simple validation without external dependencies

import { config } from '@/lib/config';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

type ValidationRule = (value: unknown, fieldName: string) => string | null;

// ============================================
// VALIDATION RULES
// ============================================

export const rules = {
  required: (message?: string): ValidationRule => (value, fieldName) => {
    if (value === null || value === undefined || value === '') {
      return message || `${fieldName} is required`;
    }
    return null;
  },

  email: (message?: string): ValidationRule => (value) => {
    if (typeof value !== 'string' || !config.validation.email.pattern.test(value)) {
      return message || config.validation.email.message;
    }
    return null;
  },

  phone: (message?: string): ValidationRule => (value) => {
    if (typeof value !== 'string') return message || 'Invalid phone number';
    const cleaned = value.replace(/\s|-/g, '');
    if (!config.validation.phone.pattern.test(cleaned)) {
      return message || config.validation.phone.message;
    }
    return null;
  },

  minLength: (min: number, message?: string): ValidationRule => (value, fieldName) => {
    if (typeof value === 'string' && value.length < min) {
      return message || `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max: number, message?: string): ValidationRule => (value, fieldName) => {
    if (typeof value === 'string' && value.length > max) {
      return message || `${fieldName} must be no more than ${max} characters`;
    }
    return null;
  },

  min: (minValue: number, message?: string): ValidationRule => (value, fieldName) => {
    if (typeof value === 'number' && value < minValue) {
      return message || `${fieldName} must be at least ${minValue}`;
    }
    return null;
  },

  max: (maxValue: number, message?: string): ValidationRule => (value, fieldName) => {
    if (typeof value === 'number' && value > maxValue) {
      return message || `${fieldName} must be no more than ${maxValue}`;
    }
    return null;
  },

  pattern: (regex: RegExp, message: string): ValidationRule => (value) => {
    if (typeof value === 'string' && !regex.test(value)) {
      return message;
    }
    return null;
  },
};

// ============================================
// VALIDATOR
// ============================================

type Schema = Record<string, ValidationRule[]>;

export function validate<T extends Record<string, unknown>>(
  data: T,
  schema: Schema
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(schema)) {
    const value = data[field];
    const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

    for (const rule of fieldRules) {
      const error = rule(value, fieldName);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for each field
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================
// PREDEFINED SCHEMAS
// ============================================

export const schemas = {
  login: {
    email: [rules.required(), rules.email()],
    password: [rules.required(), rules.minLength(6)],
  },

  student: {
    firstName: [rules.required(), rules.minLength(2), rules.maxLength(50)],
    lastName: [rules.required(), rules.minLength(2), rules.maxLength(50)],
    guardianPhone: [rules.required(), rules.phone()],
    guardianName: [rules.required()],
  },

  teacher: {
    firstName: [rules.required(), rules.minLength(2), rules.maxLength(50)],
    lastName: [rules.required(), rules.minLength(2), rules.maxLength(50)],
    email: [rules.required(), rules.email()],
    phone: [rules.required(), rules.phone()],
    salary: [rules.required(), rules.min(0)],
  },

  transaction: {
    amount: [rules.required(), rules.min(1)],
    description: [rules.required(), rules.minLength(3)],
    category: [rules.required()],
  },
};
