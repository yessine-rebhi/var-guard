import fs from 'fs';
import chalk from 'chalk';
import { findFilesInCodebase, readEnvExample } from './fileUtils.js';
import path from 'path';

export const handleStaticVariablesViolation = (staticVariables) => {
  console.error(chalk.red('❌ Policy Violation: Static environment variables found!'));
  console.error(chalk.red('   These variables should not be hardcoded:'));
  console.error(Array.from(staticVariables).map(variable => `   - ${variable}`).join('\n'));
};

export const handleExistingEnvExample = async (envExamplePath, variables) => {
  console.log(chalk.blue('📄 Existing .env.example file found.'));

  const { requiredVarsSet: existingVariables } = await readEnvExample(envExamplePath);
  const missingVariables = findMissingVariables(variables, existingVariables);
  const extraVariables = findExtraVariables(variables, existingVariables);

  if (missingVariables.length > 0) {
    console.warn(chalk.yellow('⚠️  Missing variables in .env.example:'));
    console.warn(missingVariables.map((varName) => `   - ${varName}`).join('\n'));
  }

  if (extraVariables.length > 0) {
    console.warn(chalk.yellow('⚠️  Extra variables in .env.example not found in codebase:'));
    console.warn(extraVariables.map((varName) => `   - ${varName}`).join('\n'));
  }

  if (missingVariables.length === 0 && extraVariables.length === 0) {
    console.log(chalk.green('✔️  File .env.example is in sync with the codebase.'));
  }
};

export const handleNewEnvExample = (envExamplePath, variables) => {
  console.log(chalk.blue('📄 No .env.example file found. Generating a new one...'));

  const envContent = Array.from(variables).map(variable => `${variable}=`).join('\n');

  try {
    fs.writeFileSync(envExamplePath, envContent, 'utf-8');
    console.log(chalk.green('✔️  File .env.example generated successfully.'));
    console.log(chalk.blue('   Detected variables:'));
    console.log(Array.from(variables).map(variable => `   - ${variable}`).join('\n'));
  } catch (error) {
    console.error(chalk.red('❌ Error writing to .env.example file:'));
    console.error(chalk.red(`   ${error.message}`));
  }
};

const findMissingVariables = (variables, existingVariables) => {
  return [...variables].filter((varName) => !existingVariables.has(varName));
};

const findExtraVariables = (variables, existingVariables) => {
  return [...existingVariables].filter((varName) => !variables.has(varName));
};

export const detectViteProject = async (rootDir) => {

  const viteConfigExists = ['vite.config.js', 'vite.config.ts']
    .some(file => fs.existsSync(path.join(rootDir, file)));

  const pkgPath = path.join(rootDir, 'package.json');
  let hasViteDep = false;
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath));
    hasViteDep = pkg.dependencies?.vite || pkg.devDependencies?.vite;
  }

  let usesImportMeta = false;
  const testFiles = await findFilesInCodebase(rootDir, ['js', 'ts', 'jsx', 'tsx']);
  for (const file of testFiles.slice(0, 5)) { // Check first 5 files
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('import.meta.env')) {
      usesImportMeta = true;
      break;
    }
  }

  return viteConfigExists || hasViteDep || usesImportMeta;
};