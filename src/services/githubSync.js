import axios from 'axios';

export const fetchGitHubSecrets = async (token, repo) => {
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