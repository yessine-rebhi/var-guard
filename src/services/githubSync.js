import axios from 'axios';
import chalk from 'chalk';

export const fetchGitHubSecrets = async (token, repo) => {
  if (!token || !repo) {
    const githubSecretsJSON = process.env.SECRETS_GITHUB_LIST;
    if (!allMySecretsJson) {
      console.log(chalk.red('❌ Github Secrets empty.'));
      return [];
    }
    return Object.keys(githubSecretsJSON);
  };
  const url = `https://api.github.com/repos/${repo}/actions/secrets`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.secrets.map(secret => secret.name);
};

export const compareSecrets = (requiredVars, githubSecrets) => {
  const varsToCheck = Array.isArray(requiredVars) ? requiredVars : Object.keys(requiredVars);
  return varsToCheck.filter(requiredVar => !githubSecrets.includes(requiredVar));
};