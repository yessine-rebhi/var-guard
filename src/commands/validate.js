import { generateEnvExample } from "../core/generation.js";
import validateEnv from "../core/validation.js";
import { loadConfig } from "../utils/loadConfig.js";

export const runValidate = async (options) => {
  const config = loadConfig();
  const { token, repo, schemaPath } = options;
  const isCI = process.env.CI || process.env.GITHUB_ACTIONS;

  const githubToken = token || config.githubToken;
  const repository = repo || config.repo;
  const schemaFilePath = schemaPath || config.schemaPath;
  const envPath = config.envPath;
  
  if ((!githubToken || !repository) && !isCI) {
    console.error('❌ Missing required arguments for "validate" command.');
    console.error('   Use the following options:');
    console.error('   -t, --token       GitHub token for authentication');
    console.error('   -r, --repo        Repository in the format owner/repo');
    console.error('   -s, --schemaPath  Path to the schema file');
    process.exit(1);
  }

  console.log('🔍 Running "validate" command...');
  const requiredVarsArray = await generateEnvExample();
  validateEnv({ githubToken, repository, schemaFilePath, envPath, requiredVarsArray, isCI });
};