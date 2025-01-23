import fs from 'fs';
import path from 'path';

const defaultConfig = {
  githubToken: "your_github_token",
  repo: "your_github_repo",
  schemaPath: false,
  envPath: '.env',
  envExamplePath: '.env.example',
  vitePrefix: "VITE_"
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