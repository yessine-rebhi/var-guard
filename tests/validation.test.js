import { loadEnv } from '../src/services/envLoader.js';
import { validateSchema } from '../src/validateSchema.js';

test('loadEnv should load variables from a .env file', () => {
  const envVars = loadEnv('.env');
  expect(envVars).toHaveProperty('DATABASE_URL');
});

test('validateSchema should validate environment variables against schema', () => {
  const schema = {
    type: 'object',
    required: ['DATABASE_URL'],
    properties: { DATABASE_URL: { type: 'string' } },
  };

  const envVars = { DATABASE_URL: 'postgres://localhost' };
  const errors = validateSchema(envVars, schema);
  expect(errors).toHaveLength(0);
});