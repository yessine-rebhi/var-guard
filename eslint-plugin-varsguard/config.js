import fs from 'fs';
import path from 'path';

export function loadConfig() {
  const configPath = path.join(process.cwd(), '.varsguardrc');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {};
}