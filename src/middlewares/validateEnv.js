import { loadEnv } from '../services/envLoader.js';
import { validateEnvService } from '../services/validateEnvService.js';
import { fetchGitHubSecrets, compareSecrets } from '../services/githubSync.js';
import chalk from 'chalk';


const validateEnv = async ({ token, repo, useSchemaValidation }) => {
  if (!token || !repo) {
    console.error(chalk.red('❌ Error: Both GitHub token and repository are required.'));
    process.exit(1);
  }

  try {
    console.log("token", token);
    console.log("repo", repo);
    // Load environment variables and .env.example file
    const requiredVars = loadEnv('.env', '.env.example');
    console.log(chalk.green('✔️  Loaded environment variables from .env and .env.example.'));

    // If schema validation is enabled, validate environment variables against the schema
    if (useSchemaValidation) {
      console.log(chalk.green('✔️  Schema validation enabled. Checking against schema.json...'));
      validateEnvService(requiredVars, 'schema.json');
      console.log(chalk.green('✔️  Environment variables are valid according to the schema.'));
    } else {
      console.log(chalk.yellow('⚠️  Schema validation skipped.'));
    }

    // Fetch GitHub secrets and compare them with local variables
    console.log(chalk.green('✔️  Fetching GitHub secrets...'));
    const githubSecrets = await fetchGitHubSecrets(token, repo);
    const missingSecrets = compareSecrets(requiredVars, githubSecrets);

    // Display results based on missing secrets
    if (missingSecrets.length > 0) {
      console.log(chalk.red('❌  Missing Secrets:'));
      missingSecrets.forEach(secret => {
        console.log(chalk.red(`  - ${secret} is missing in GitHub secrets.`));
      });
    } else {
      console.log(chalk.green('✔️  No missing secrets found in GitHub.'));
    }

    console.log(chalk.green('✔️  Validation completed successfully.'));
  } catch (error) {
    console.error(chalk.red(`❌  Validation failed: ${error.message}`));
    process.exit(1);
  }
};

export default validateEnv;
