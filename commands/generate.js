import { generateEnvExampleFromCode } from "../src/services/generateEnvExampleFromCode.js";

export const runGenerate = () => {
  console.log('🔍 Running "generate" command...');
  generateEnvExampleFromCode();
};