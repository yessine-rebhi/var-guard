import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';

export const validateEnvService = (envVars, schemaPath) => {
  if (Array.isArray(envVars)) throw new Error(`.env file must be defined to perform the validation`);
  const ajv = new Ajv({ allErrors: true, strict: false });

  addFormats(ajv);
  const resolvedPath = path.resolve(process.cwd(), schemaPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Schema file not found at: ${resolvedPath}`);
  }

  const schema = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
  const validate = ajv.compile(schema);
  const valid = validate(envVars);
  if (!valid) {
    const errors = validate.errors.map(err => `${err.instancePath}: ${err.message}`).join('; ');
    throw new Error(`Environment validation failed: ${errors}`);
  }
};