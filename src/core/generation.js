import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findEnvVariablesInCodebase } from "../utils/fileUtils.js";
import { handleExistingEnvExample, handleNewEnvExample, handleStaticVariablesViolation } from '../utils/envUtils.js';

export const generateEnvExample = () => {
  const projectRootDir = process.cwd();
  const variables = new Set();
  const staticVariables = new Set();
  const envExamplePath = path.join(projectRootDir, '.env.example');

  console.log(chalk.blue('🔍 Scanning codebase for environment variables...'));

  findEnvVariablesInCodebase(projectRootDir, variables, staticVariables);

  if (staticVariables.size > 0) {
    handleStaticVariablesViolation(staticVariables);
    process.exit(1);
  }

  if (variables.size === 0) {
    console.error(chalk.yellow('⚠️  No environment variables detected in the codebase!'));
    process.exit(0);
  }

  if (fs.existsSync(envExamplePath)) {
    handleExistingEnvExample(envExamplePath, variables);
  } else {
    handleNewEnvExample(envExamplePath, variables);
  }
  return Array.from(variables);
};