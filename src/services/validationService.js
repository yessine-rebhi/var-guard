import fs from 'fs/promises';
import Ajv from 'ajv';

const ajv = new Ajv();

const validate = async (envPath, schemaPath) => {
  const [envFile, schemaFile] = await Promise.all([
    fs.readFile(envPath, 'utf8'),
    fs.readFile(schemaPath, 'utf8'),
  ]);

  const schema = JSON.parse(schemaFile);
  const validate = ajv.compile(schema);

  const envVariables = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key) acc[key.trim()] = value?.trim();
    return acc;
  }, {});

  const valid = validate(envVariables);
  if (!valid) throw new Error(`Validation failed: ${ajv.errorsText(validate.errors)}`);

  return envVariables;
};

export default { validate };