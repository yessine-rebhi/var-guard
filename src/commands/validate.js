import { generateEnvExample } from "../core/generation.js";
import validateEnv from "../core/validation.js";

export const runValidate = (options) => {
  const { token, repo, schemaPath } = options;
  const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
  if ((!token || !repo) && !isCI) {
    console.error('❌ Missing required arguments for "validate" command.');
    console.error('   Use the following options:');
    console.error('   -t, --token       GitHub token for authentication');
    console.error('   -r, --repo        Repository in the format owner/repo');
    console.error('   -s, --schemaPath  Path to the schema file');
    process.exit(1);
  }

  console.log('🔍 Running "validate" command...');
  const requiredVarsArray = generateEnvExample();
  validateEnv({ token, repo, schemaPath, requiredVarsArray });
};