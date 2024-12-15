import { loadEnv } from '../services/envLoader.js';
import { validateEnvService } from '../services/validateEnvService.js';
import { fetchGitHubSecrets, compareSecrets } from '../services/githubSync.js';

const validateEnvController = async (req, res) => {
  try {
    const { token, repo, useSchemaValidation } = req.body;
    
    // Load and validate .env
    const requiredVars = loadEnv('.env', '.env.example');
    // Validate against schema
    if (useSchemaValidation) {
      validateEnvService(requiredVars, 'schema.json');
    }

    // Fetch and compare GitHub secrets
    const githubSecrets = await fetchGitHubSecrets(token, repo);
    const missingSecrets = compareSecrets(requiredVars, githubSecrets);

    res.json({
      message: 'Validation successful',
      missingSecrets,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default validateEnvController;