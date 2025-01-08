import fs from 'fs/promises';
import path from 'path';
import { parse } from '@babel/parser';
import _traverse from "@babel/traverse";
import chalk from 'chalk';

const traverse = _traverse.default;
const isTextFile = (fileName) => {
  const textFileExtensions = [
    '.js', '.ts', '.jsx', '.tsx', '.py',
  ];
  return textFileExtensions.some((ext) => fileName.endsWith(ext));
};

export const findEnvVariablesInCodebase = async (dir, variables, staticVariables) => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!['node_modules', '.git', '.github', 'dist', 'build', 'coverage', 'tests'].includes(entry.name)) {
          await findEnvVariablesInCodebase(fullPath, variables, staticVariables);
        }
      } else if (isTextFile(entry.name)) {
        await extractEnvVariables(fullPath, variables, staticVariables);
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error reading directory: ${dir}`));
    console.error(chalk.red(`   ${error.message}`));
  }
};

const extractEnvVariables = async (filePath, variables, staticVariables) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    if (content.length === 0) {
      console.warn(chalk.yellow(`Empty file: ${filePath}`));
      return;
    }

    if (filePath.endsWith('.py')) {
      extractPythonEnvVariables(content, variables);
    } else {
      let ast;
      try {
        ast = parse(content, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        });
      } catch (parseError) {
        console.error(chalk.red(`❌ Error parsing file: ${filePath}`));
        console.error(chalk.red(`   ${parseError.message}`));
        return;
      }

      const envVars = collectEnvVariables(ast);
      envVars.forEach((varName) => variables.add(varName));
      // Check for static variable assignments
      traverse(ast, {
        enter: function (path) {
          const node = path.node;
          if (node.type === 'VariableDeclarator' && node.init) {
            if (node.init.type === 'Literal' && typeof node.init.value === 'string') {
              const varName = node.id.name;
              staticVariables.add(varName);
            }
          }
        },
      });
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error reading file: ${filePath}`));
    console.error(chalk.red(`   ${error.message}`));
  }
};

function collectEnvVariables(ast) {
  const variables = new Set();

  traverse(ast, {
    enter: function (path) {
      const node = path.node;
      if (node.type === 'MemberExpression' && isProcessEnv(node.object)) {
        if (node.property.type === 'Identifier') {
          variables.add(node.property.name);
        } else if (node.property.type === 'Literal') {
          variables.add(node.property.value);
        } else if (node.computed) {
          variables.add(`computed_${node.property.type}`);
        }
      }
    },
  });


  return variables;
}

function isProcessEnv(node) {
  return node.type === 'MemberExpression' &&
    node.object.type === 'Identifier' &&
    node.object.name === 'process' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'env';
}

const extractPythonEnvVariables = (content, variables) => {
  const getenvPattern = /os\.getenv\(['"]([^'"]*)['"]\)/g;
  let match;
  while ((match = getenvPattern.exec(content)) !== null) {
    variables.add(match[1]);
  }

  const environPattern = /os\.environ\[['"]([^'"]*)['"]\]/g;
  while ((match = environPattern.exec(content)) !== null) {
    variables.add(match[1]);
  }

  const environGetPattern = /os\.environ\.get\(['"]([^'"]*)['"]\)/g;
  while ((match = environGetPattern.exec(content)) !== null) {
    variables.add(match[1]);
  }
};

export const readEnvExample = async (filePath) => {
  const requiredVars = new Set();
  const duplicates = new Set();

  try {
    const content = await fs.readFile(filePath, { encoding: 'utf-8' });
    const lines = content.split(/\r?\n/);

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Ignore comments and blank lines
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        // Split on the first '=' to handle inline comments
        const parts = trimmedLine.split(/=/, 2);
        const varName = parts[0].trim();

        if (varName) {
          // Check for duplicates
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
    if (error.code === 'ENOENT') {
      console.warn(chalk.yellow(`🔍 .env.example file not found at: ${filePath}`));
    } else {
      console.error(chalk.red(`❌ Error reading .env.example file: ${filePath}`));
      console.error(chalk.red(`   ${error.message}`));
    }
  }

  return { requiredVarsArray: Array.from(requiredVars), requiredVarsSet: requiredVars };
};

export const findFilesInCodebase = async (dir) => {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.github', 'dist', 'build'].includes(entry.name)) {
        files.push(...await findFilesInCodebase(fullPath));
      }
    } else if (isTextFile(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
};