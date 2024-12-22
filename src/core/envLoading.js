import chalk from "chalk";
import fs from 'fs'
import dotenv from 'dotenv'

export const loadEnv = async (envPath, requiredVarsArray, schemaPath) => {
  const isCI = process.env.CI || process.env.GITHUB_ACTIONS;

  // If .env does not exist
  if (!fs.existsSync(envPath)) {
    if (isCI) {
      console.log(chalk.yellow('⚠️  Running in CI/CD environment.'));
      console.log(chalk.green('✔️  Assuming environment variables are injected at runtime.'));
    } else {
      console.log(chalk.yellow('⚠️  No ".env" file found! Using ".env.example" as the reference.'));
      console.log(
        chalk.red('⚠️  Please create a ".env" file and define these required variables: \n') +
        requiredVarsArray.map((varName) => `- ${varName}`).join('\n')
      );
    }

    return requiredVarsArray;
  }

  dotenv.config({ path: envPath });
  console.log(chalk.green('✔️  Successfully loaded ".env" file.'));
  const missingVars = requiredVarsArray.filter(
    (varName) => !process.env[varName] || process.env[varName].trim() === ''
  );

  if (missingVars.length > 0) {
    console.log(chalk.red.bold('❌ Missing or Empty Environment Variables'));
    console.log(chalk.yellow('⚠️  Please update your ".env" file with these variables:'));
    console.log(missingVars.map((varName) => `- ${varName}`).join('\n'));
  }

  if (schemaPath) {
    const envObject = {};
    requiredVarsArray.forEach((varName) => {
      envObject[varName] = process.env[varName] || '';
    });
    return envObject;
  }

  return requiredVarsArray;
};