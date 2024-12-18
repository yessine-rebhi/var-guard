import fs from 'fs';
import path from 'path';
import { generateEnvExampleFromCode } from './generateEnvExampleFromCode.js';

export const parseEnvExample = (examplePath) => {
  try {
    if (!fs.existsSync(examplePath)) {
      console.log(`File ${examplePath} not found. Creating it dynamically...`);
      generateEnvExampleFromCode();
    }

    const content = fs.readFileSync(path.resolve(examplePath), 'utf-8');

    return content
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.split('=')[0]);

  } catch (error) {
    console.error('Error reading or processing the .env.example file:', error.message);
    process.exit(1);
  }
};