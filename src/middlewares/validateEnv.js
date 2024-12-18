import { loadEnv } from '../services/envLoader.js';
import { validateEnvService } from '../services/validateEnvService.js';
import { fetchGitHubSecrets, compareSecrets } from '../services/githubSync.js';
import chalk from 'chalk';

const validateEnv = async ({ token, repo, schemaValidation }) => {
  const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
  if ((!token || !repo) && !isCI) {
    console.error(chalk.red('❌ Error: Both GitHub token and repository are required.'));
    process.exit(1);
  }

  try {
    console.log(chalk.blue('🔍 Loading environment variables...'));
    const requiredVars = loadEnv('.env', '.env.example', schemaValidation);

    if (schemaValidation) {
      console.log(chalk.green('✔️  Schema validation enabled. Checking against schema.json...'));
      validateEnvService(requiredVars, 'schema.json');
      console.log(chalk.green('✔️  Environment variables are valid according to the schema.'));
    } else {
      console.log(chalk.yellow('⚠️  Schema validation skipped (schema tag set to false).'));
    }

    console.log(chalk.blue('🔍 Fetching GitHub secrets...'));
    const githubSecrets = await fetchGitHubSecrets(token, repo);
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