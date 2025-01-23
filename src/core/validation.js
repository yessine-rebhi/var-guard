import chalk from 'chalk';
import {  } from '../utils/schemaUtils.js';
import { compareSecrets, fetchGitHubSecrets } from './synchronization.js';
import { loadEnv } from './envLoading.js';

const validateEnv = async ({ githubToken, repository, schemaFilePath, envPath, requiredVarsArray, isCI }) => {
  try {
    console.log(chalk.blue('🔍 Loading environment variables...'));
    const requiredVars = await loadEnv(envPath, requiredVarsArray, schemaFilePath);

    if (schemaFilePath) {
      console.log(chalk.green('✔️  Schema validation enabled. Checking against schema.json...'));
      validateEnvService(requiredVars, schemaFilePath);
      console.log(chalk.green('✔️  Environment variables are valid according to the schema.'));
    } else {
      console.log(chalk.yellow('⚠️  Schema validation skipped (schemaPath tag not provided).'));
    }

    console.log(chalk.blue('🔍 Fetching GitHub secrets...'));
    const githubSecrets = await fetchGitHubSecrets(githubToken, repository, isCI);
    const missingSecrets = compareSecrets(requiredVars, githubSecrets);

    if (missingSecrets.length > 0) {
      console.log(chalk.red.bold('❌ Missing Secrets in GitHub:'));
      missingSecrets.forEach((secret) => {
        console.log(chalk.red(`- ${secret}`));
      });
    } else {
      console.log(chalk.green('✔️  All GitHub secrets are correctly set.'));
    }

    console.log(chalk.green('✔️  Validation completed successfully.'));
  } catch (error) {
    console.error(chalk.red(`❌ Validation failed: ${error.message}`));
    process.exit(1);
  }
};

export default validateEnv;