import chokidar from 'chokidar';
import chalk from 'chalk';
import validateEnv from '../src/middlewares/validateEnv.js';

export const runWatch = (args) => {
  const { token, repo, schemaPath } = args;

  console.log(chalk.blue('👀 Watching for changes in environment files...'));

  const watcher = chokidar.watch(['.env', '.env.example', schemaPath || 'schema.json'], {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on('change', (filePath) => {
    console.log(chalk.blue(`🔄 File changed: ${filePath}`));
    validateEnv({ token, repo, schemaPath });
  });

  watcher.on('error', (error) => {
    console.error(chalk.red(`❌ Watcher error: ${error.message}`));
  });
};