import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const excludedVars = ['CI', 'GITHUB_ACTIONS'];

const findProcessEnvVariables = (dir, variables) => {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') {
          findProcessEnvVariables(fullPath, variables);
        }
      } else if (/\.(js|ts|jsx|tsx)$/.test(entry.name)) {
        extractEnvVariablesFromFile(fullPath, variables);
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error reading directory: ${dir}`));
    console.error(chalk.red(`   ${error.message}`));
  }
};

const extractEnvVariablesFromFile = (filePath, variables) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /(?<!\/\*|\/\/|['"`])\bprocess\.env\.([\w\d_]+)\b(?!\s*:)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const varName = match[1];
      if (!excludedVars.includes(varName)) {
        variables.add(varName);
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error reading file: ${filePath}`));
    console.error(chalk.red(`   ${error.message}`));
  }
};

export const generateEnvExampleFromCode = () => {
  const rootDir = path.resolve('./');
  const variables = new Set();

  console.log(chalk.blue('🔍 Starting scan for environment variables in the codebase...'));
  findProcessEnvVariables(rootDir, variables);

  if (variables.size > 0) {
    const envFilePath = path.join(rootDir, '.env.example');
    const envContent = Array.from(variables).map(variable => `${variable}=`).join('\n');

    try {
      fs.writeFileSync(envFilePath, envContent, 'utf-8');
      console.log(chalk.green('✔️  .env.example file generated successfully.'));
      console.log(chalk.green(`   File location: ${envFilePath}`));
      console.log(chalk.blue(`   Detected variables:`));
      console.log(Array.from(variables).map(variable => `   - ${variable}`).join('\n'));
    } catch (error) {
      console.error(chalk.red('❌ Error writing to .env.example file:'));
      console.error(chalk.red(`   ${error.message}`));
    }
  } else {
    console.log(chalk.yellow('⚠️  No environment variables found in the codebase.'));
    console.log(chalk.yellow('   Ensure your code uses `process.env.VARIABLE_NAME` for environment variables.'));
  }
};