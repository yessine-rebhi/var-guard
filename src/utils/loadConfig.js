import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const CONFIG_FILE_NAME = '.varsguardrc';

export const loadConfig = () => {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE_NAME);

  if (!fs.existsSync(configPath)) {
    console.log(chalk.yellow(`⚠️  No ${CONFIG_FILE_NAME} found. Using defaults.`));
    return {};
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config;
  } catch (error) {
    console.log(chalk.red(`❌ Error reading ${CONFIG_FILE_NAME}: ${error.message}`));
    process.exit(1);
  }
};