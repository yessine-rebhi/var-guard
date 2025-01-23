import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { findEnvVariablesInCodebase } from "../utils/fileUtils.js";
import { detectViteProject, handleExistingEnvExample, handleNewEnvExample, handleStaticVariablesViolation } from '../utils/envUtils.js';
import { loadConfig } from '../utils/loadConfig.js';

export const generateEnvExample = async () => {
  const config = loadConfig();
  const projectRootDir = process.cwd();
  const variables = new Set();
  const staticVariables = new Set();

  const envExamplePath = path.join(projectRootDir, config.envExamplePath);

  console.log(chalk.blue('🔍 Scanning codebase for environment variables...'));
  await findEnvVariablesInCodebase(projectRootDir, variables, staticVariables);

  const envStaticVariables = Array.from(staticVariables).filter(varName =>
    variables.has(varName)
  );

  if (envStaticVariables.length > 0) {
    handleStaticVariablesViolation(envStaticVariables);
    process.exit(1);
  }

  // Vite-specific filtering
  let filteredVariables = new Set(variables);
  const isViteProject = await detectViteProject(projectRootDir);

  if (isViteProject) {
    const VITE_IGNORED = ['MODE', 'DEV', 'PROD', 'SSR']; // Vite's built-in vars
    const prefix = config.vitePrefix || 'VITE_';

    filteredVariables = new Set(
      Array.from(filteredVariables).filter(varName =>
        !VITE_IGNORED.includes(varName) &&
        (prefix === '' || varName.startsWith(prefix))
      )
    );

    if (filteredVariables.size === 0 && variables.size > 0) {
      console.log(chalk.yellow(`⚠️  No variables found with Vite prefix '${prefix}'`));
      console.log(chalk.yellow('   Detected variables:'), Array.from(variables).join(', '));
      process.exit(0);
    }
  }

  if (filteredVariables.size === 0) {
    console.error(chalk.yellow('⚠️  No environment variables detected in the codebase!'));
    process.exit(0);
  }

  // Use filtered variables for example generation
  if (fs.existsSync(envExamplePath)) {
    await handleExistingEnvExample(envExamplePath, filteredVariables);
  } else {
    handleNewEnvExample(envExamplePath, filteredVariables);
  }

  return Array.from(filteredVariables);
};