import type { z } from 'zod';

/**
 * Validate a value against a Zod schema and return a flat map of
 * `fieldName -> message` for the first issue on each field. Empty object means
 * valid. Because most resume fields are optional (empty = valid), this only
 * surfaces real problems like malformed emails/URLs.
 */
export function fieldErrors(schema: z.ZodTypeAny, value: unknown): Record<string, string> {
  const result = schema.safeParse(value);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '_root';
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}
