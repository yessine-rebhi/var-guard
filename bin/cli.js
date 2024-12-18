import minimist from 'minimist';
import validateEnv from '../src/middlewares/validateEnv.js';

const runCLI = () => {
  const args = minimist(process.argv.slice(2));

  const token = args['token'];
  const repo = args['repo'];
  const schemaValidation = args['schema'] === 'true';

  validateEnv({ token, repo, schemaValidation });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI();
}
