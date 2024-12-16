import minimist from 'minimist';
import validateEnv from '../src/middlewares/validateEnv.js';

/**
 * Function to parse CLI arguments and invoke the validateEnv function.
 */
const runCLI = () => {
  const args = minimist(process.argv.slice(2));

  // Extract arguments or fallbacks to environment variables
  const token = args['token'] || process.env.GITHUB_TOKEN;
  const repo = args['repo'] || 'yessine-rebhi/var-guard';
  const useSchemaValidation = args['schema'] === 'true';

  // Call the validateEnv function with parsed arguments
  validateEnv({ token, repo, useSchemaValidation });
};

// Expose the runCLI function for use in CLI environments
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI();
}
