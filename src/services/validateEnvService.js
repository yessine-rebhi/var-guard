import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';

export const validateEnvService = (envVars, schemaPath) => {
  const ajv = new Ajv({ allErrors: true, strict: false });

  addFormats(ajv);

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const validate = ajv.compile(schema);
  console.log('env',envVars);
  const valid = validate(envVars);
  if (!valid) {
    const errors = validate.errors.map(err => `${err.instancePath}: ${err.message}`).join('; ');
    throw new Error(`Environment validation failed: ${errors}`);
  }
};