import dotenv from 'dotenv';
import { parseEnvExample } from './exampleParser.js';
import chalk from 'chalk';
import fs from 'fs';

export const loadEnv = (envPath, examplePath, schemaPath) => {
  const requiredVars = parseEnvExample(examplePath);

  const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
  const a = process.env.test

  // If .env does not exist
  if (!fs.existsSync(envPath)) {
    if (isCI) {
      console.log(chalk.yellow('⚠️  Running in CI/CD environment.'));
      console.log(chalk.green('✔️  Assuming environment variables are injected at runtime.'));
    } else {
      console.log(chalk.yellow('⚠️  No ".env" file found! Using ".env.example" as the reference.'));
      console.log(
        chalk.blue('The following environment variables are required:\n') +
        requiredVars.map((varName) => `- ${varName}`).join('\n')
      );
      console.log(chalk.red('⚠️  Please create a ".env" file and define these variables.'));
    }
    return requiredVars;
  }

  dotenv.config({ path: envPath });
  console.log(chalk.green('✔️  Successfully loaded ".env" file.'));

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName] || process.env[varName].trim() === ''
  );

  if (missingVars.length > 0) {
    console.log(chalk.red.bold('❌ Missing or Empty Environment Variables:'));
    console.log(missingVars.map((varName) => `- ${varName}`).join('\n'));
    console.log(chalk.yellow('⚠️  Please update your ".env" file with these variables.'));
  }

  if (schemaPath) {
    const envObject = {};
    requiredVars.forEach((varName) => {
      envObject[varName] = process.env[varName] || '';
    });
    return envObject;
  }

  return requiredVars;
};