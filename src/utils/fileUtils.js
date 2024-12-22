import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const isTextFile = (fileName) => {
  const textFileExtensions = [
    '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.go', '.rb',
    '.php', '.html', '.css', '.json', '.yaml', '.yml', '.sh', '.bat', '.env',
  ];
  return textFileExtensions.some((ext) => fileName.endsWith(ext));
};

const extractEnvVariables = (filePath, variables, staticVariables) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const dynamicRegex = /\b(?:process\.env\.|ENV\[|getenv\(['"`]|System\.getEnv\(['"`]|os\.getenv\(['"`]|os\.environ\['"`)([\w\d_]+)/g;
    const excludedVars = ['CI', 'GITHUB_ACTIONS', 'GSL_GITHUB_SECRETS'];
    let match;

    while ((match = dynamicRegex.exec(content)) !== null) {
      const varName = match[1];
      if (!excludedVars.includes(varName)) {
        variables.add(varName);
      }
    }

    const staticRegex = /\b([A-Z_][A-Z\d_]*)\s*=\s*['"][^'"]+['"]/g;
    while ((match = staticRegex.exec(content)) !== null) {
      const varName = match[1];
      if (!excludedVars.includes(varName)) {
        staticVariables.add(varName);
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error reading file: ${filePath}`));
    console.error(chalk.red(`   ${error.message}`));
  }
};

export const readEnvExample = (filePath) => {
  const requiredVars = new Set();
  const duplicates = new Set();

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach((line) => {
      const trimmedLine = line.trim();

      // Ignore comments and blank lines
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key] = trimmedLine.split('=');
        if (key && key.trim()) {
          const varName = key.trim();

          // If variable already exists in the Set, it's a duplicate
          if (requiredVars.has(varName)) {
            duplicates.add(varName);
          } else {
            requiredVars.add(varName);
          }
        }
      }
    });

    // Inform about duplicates
    if (duplicates.size > 0) {
      console.warn(chalk.yellow('⚠️  Duplicated variables found in .env.example:'));
      duplicates.forEach((varName) => {
        console.warn(`   - ${varName}`);
      });
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error reading .env.example file: ${filePath}`));
    console.error(chalk.red(`   ${error.message}`));
  }

  return { requiredVarsArray: Array.from(requiredVars), requiredVarsSet: requiredVars };
};

export const findEnvVariablesInCodebase = (dir, variables, staticVariables) => {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!['node_modules', '.git', '.github', 'dist', 'build'].includes(entry.name)) {
          findEnvVariablesInCodebase(fullPath, variables, staticVariables);
        }
      } else if (isTextFile(entry.name)) {
        extractEnvVariables(fullPath, variables, staticVariables);
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error reading directory: ${dir}`));
    console.error(chalk.red(`   ${error.message}`));
  }
};