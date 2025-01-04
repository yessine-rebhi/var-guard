#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { runGenerate } from './commands/generate.js';
import { runValidate } from './commands/validate.js';
import { runInit } from './commands/init.js';

const program = new Command();

program
  .version('0.1.0')
  .description('VarsGuard: Secure and streamline environment variable management.');
  
program
  .command('init')
  .description('Generate a default .varsguardrc configuration file')
  .action(() => {
    runInit();
  });

program
  .command('generate')
  .description('Scan the codebase and generate .env.example')
  .action(async () => {
    await runGenerate();
  });

program
  .command('validate')
  .description('Validate .env against .env.example or schema.json')
  .option('-t, --token <token>', 'GitHub token for accessing the repository')
  .option('-r, --repo <repo>', 'GitHub repository in the format owner/repo')
  .option('-s, --schemaPath <schemaPath>', 'Path to the schema file')
  .action(async (options) => {
    await runValidate(options);
  });

program.on('command:*', () => {
  console.log(chalk.red(`❌ Unknown command: ${program.args[0]}`));
  program.help();
});

program.parse(process.argv);