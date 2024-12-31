import fs from 'fs';
import path from 'path';

const defaultConfig = {
  githubToken: null,
  repo: null,
  schemaPath: false,
  envPath: '.env',
  envExamplePath: '.env.example'
};

export const loadConfig = () => {
  const configPath = path.join(process.cwd(), '.varsguardrc');
  let userConfig = {};

  if (fs.existsSync(configPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (error) {
      console.error('Error parsing .varsguardrc: please verify the file is valid JSON.');
    }
  }

  return { ...defaultConfig, ...userConfig };
};