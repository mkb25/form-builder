import { z } from 'zod';
import type { FormSchema, FormField } from '../types';

export const generateZodSchema = (schema: FormSchema) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  schema.fields.forEach((field: FormField) => {
    let fieldValidator: z.ZodTypeAny;

    switch (field.type) {
      case 'number':
        fieldValidator = z.coerce.number();
        break;
      case 'checkbox':
        fieldValidator = z.array(z.string());
        if (field.required) {
          fieldValidator = (fieldValidator as z.ZodArray<z.ZodString>).min(1, 'Please select at least one option');
        }
        break;
      case 'text':
      case 'select':
      case 'radio':
      default:
        fieldValidator = z.string();
        if (field.required) {
          fieldValidator = (fieldValidator as z.ZodString).min(1, 'This field is required');
        } else {
          fieldValidator = fieldValidator.optional().or(z.literal(''));
        }
        break;
    }

    // Apply any additional validation rules if they exist in the schema
    // (This allows for future extensibility)
    if (field.validation && field.validation.length > 0 && field.type !== 'checkbox') {
      field.validation.forEach(rule => {
        if (rule.type === 'min' && field.type === 'number') {
           fieldValidator = (fieldValidator as z.ZodNumber).min(rule.value, rule.message);
        }
        if (rule.type === 'max' && field.type === 'number') {
           fieldValidator = (fieldValidator as z.ZodNumber).max(rule.value, rule.message);
        }
        if (rule.type === 'email' && field.type === 'text') {
           fieldValidator = (fieldValidator as z.ZodString).email(rule.message);
        }
      });
    }

    shape[field.id] = fieldValidator;
  });

  return z.object(shape);
};
