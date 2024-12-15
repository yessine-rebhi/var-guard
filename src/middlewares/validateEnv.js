import { loadEnv } from '../services/envLoader.js';
import { validateEnvService } from '../services/validateEnvService.js';
import { fetchGitHubSecrets, compareSecrets } from '../services/githubSync.js';

const validateEnv = async ({ token, repo, useSchemaValidation }) => {
  if (!token || !repo) {
    console.error('Error: Both GitHub token and repository are required.');
    process.exit(1);
  }

  try {
    // Load and validate .env variables
    const requiredVars = loadEnv('.env', '.env.example');

    // Validate against schema if the flag is provided
    if (useSchemaValidation) {
      validateEnvService(requiredVars, 'schema.json');
    }

    // Fetch GitHub secrets and compare them
    const githubSecrets = await fetchGitHubSecrets(token, repo);
    const missingSecrets = compareSecrets(requiredVars, githubSecrets);

    // Output result
    console.log('Validation completed successfully.');
    if (missingSecrets.length > 0) {
      console.log('Missing Secrets:', missingSecrets);
    } else {
      console.log('No missing secrets found.');
    }
  } catch (error) {
    console.error(`Validation failed: ${error.message}`);
    process.exit(1);
  }
};

export default validateEnv;