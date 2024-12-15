import fs from 'fs';
import path from 'path';

export const parseEnvExample = (examplePath) => {
  const content = fs.readFileSync(path.resolve(examplePath), 'utf-8');
  return content
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=')[0]);
};