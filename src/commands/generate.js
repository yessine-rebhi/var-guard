import { generateEnvExample } from "../core/generation.js";

export const runGenerate = async () => {
  console.log('🔍 Running "generate" command...');
  await generateEnvExample();
};