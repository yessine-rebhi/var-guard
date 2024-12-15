import { Command } from 'commander';
import validationService from './services/validationService.js';

const program = new Command();

program
  .command('validate')
  .description('Validate environment variables')
  .requiredOption('-e, --env <path>', 'Path to the .env file')
  .requiredOption('-s, --schema <path>', 'Path to the schema file')
  .action(async (options) => {
    try {
      const result = await validationService.validate(options.env, options.schema);
      console.log('Validation successful:', result);
    } catch (err) {
      console.error('Validation failed:', err.message);
    }
  });

program.parse(process.argv);