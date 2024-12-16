import dotenv from 'dotenv';
import { parseEnvExample } from './exampleParser.js';
import chalk from 'chalk';

export const loadEnv = (envPath, examplePath) => {
  const requiredVars = parseEnvExample(examplePath);

  dotenv.config({ path: envPath });
  if (!process.env.NODE_ENV) {
    console.log(chalk.green('✔️  Loaded environment variables from .env.example.'));
    return requiredVars;
  }

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

  console.log(chalk.green('✔️  Loaded environment variables from .env and .env.example.'));

  return filteredEnv;
};