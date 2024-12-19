#!/usr/bin/env node
import minimist from 'minimist';
import chalk from 'chalk';
import { runGenerate } from '../commands/generate.js';
import { runValidate } from '../commands/validate.js';
import { runWatch } from '../commands/watch.js';

const args = minimist(process.argv.slice(2));
const command = args._[0];

const helpMessage = `
Usage: npx var-guard <command> [options]

Commands:
  generate    Scan the codebase and generate .env.example
  validate    Validate .env against .env.example or schema.json
  watch       Watch for changes in environment files and validate them

Options:
  --help      Show help for a specific command
`;

if (!command || args.help) {
  console.log(helpMessage);
  process.exit(0);
}

switch (command) {
  case 'generate':
    runGenerate();
    break;
  case 'validate':
    runValidate(args);
    break;
  case 'watch':
    runWatch(args);
    break;
  default:
    console.log(chalk.red(`❌ Unknown command: ${command}`));
    console.log(helpMessage);
    process.exit(1);
}