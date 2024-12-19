import validateEnv from "../src/middlewares/validateEnv.js";

export const runValidate = (args) => {
  const { token, repo, schemaPath } = args;
  console.log('🔍 Running "validate" command...');
  validateEnv({ token, repo, schemaPath });
};