import axios from 'axios';
import chalk from 'chalk';

export const fetchGitHubSecrets = async (token, repo) => {
  const url = `https://api.github.com/repos/${repo}/actions/secrets`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Handle pagination
    let secrets = response.data.secrets.map(secret => secret.name);
    // Check if there's a next page
    let nextPage = response.data['next'];
    while (nextPage) {
      const nextPageResponse = await axios.get(nextPage, {
        headers: { Authorization: `Bearer ${token}` },
      });
      secrets = secrets.concat(nextPageResponse.data.secrets.map(secret => secret.name));
      nextPage = nextPageResponse.data['next'];
    }
    return secrets;
  } catch (error) {
    console.error(chalk.red('❌ Error fetching GitHub secrets:', error.response.data.message));
    process.exit(1);
  }
};

export const compareSecrets = (requiredVars, githubSecrets) => {
  const requiredArray = Array.isArray(requiredVars) ? requiredVars : Object.keys(requiredVars);
  const missing = requiredArray.filter(varName => !githubSecrets.includes(varName));
  return missing;
};