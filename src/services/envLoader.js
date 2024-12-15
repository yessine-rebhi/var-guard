import dotenv from 'dotenv';
import { parseEnvExample } from './exampleParser.js';

export const loadEnv = (envPath, examplePath) => {
  dotenv.config({ path: envPath });

  const requiredVars = parseEnvExample(examplePath);
  const filteredEnv = {};
  const missingVars = [];

  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      filteredEnv[varName] = process.env[varName];
    } else {
      missingVars.push(varName);
    }
  });
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  return filteredEnv;
};