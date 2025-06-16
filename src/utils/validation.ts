import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateResponse<T>(schema: object, data: unknown, context?: string): T {
  const validate = ajv.compile(schema as JSONSchemaType<T>);
  const valid = validate(data);
  if (!valid) {
    const msg = `Validation failed${context ? ` in ${context}` : ''}: ${ajv.errorsText(validate.errors)}`;
    throw new Error(msg);
  }
  return data as T;
}
