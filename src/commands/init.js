import fs from 'fs';
import path from 'path';

export const runInit = () => {
  const configPath = path.join(process.cwd(), '.varsguardrc');
  const defaultConfig = {
    githubToken: "your_github_token",
    repo: "your_github_token",
    schemaPath: false,
    envPath: '.env',
    envExamplePath: '.env.example',
    viteMode: false,
    vitePrefix: "VITE_"
  };

  if (fs.existsSync(configPath)) {
    console.log('Configuration file .varsguardrc already exists. Not overwriting.');
    return;
  }

  try {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`Configuration file .varsguardrc created at ${configPath}`);
  } catch (error) {
    console.error('Error creating .varsguardrc:', error);
  }
};