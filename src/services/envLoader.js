import dotenv from 'dotenv';
import { parseEnvExample } from './exampleParser.js';

export const loadEnv = (envPath, examplePath) => {
  const requiredVars = parseEnvExample(examplePath);
  
  dotenv.config({ path: envPath });
  if (!process.env.NODE_ENV) return requiredVars;
  
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