import axios from 'axios';
import { logChange } from './audit.js';

const getGitHubCommits = async (token, repo) => {
  const url = `https://api.github.com/repos/${repo}/commits`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch commits: ${error.response?.data?.message || error.message}`);
  }
};

const getCommitDetails = async (token, repo, sha) => {
  const url = `https://api.github.com/repos/${repo}/commits/edc73461805e5e1f3fc548f977ee8a67d895c0d6`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch commit details for SHA ${sha}: ${error.response?.data?.message || error.message}`);
  }
};

export const trackChangesInGitHub = async (token, repo) => {
  const commits = await getGitHubCommits(token, repo);
  for (const commit of commits) {
    const commitDetails = await getCommitDetails(token, repo, commit.sha);

    if (commitDetails.files && Array.isArray(commitDetails.files)) {
      commitDetails.files.forEach((file) => {
        if (file.filename === '.env.example' || file.filename === 'schema.json') {
          const changeDetails = {
            action: file.status,
            variable: file.filename,
            user: commitDetails.committer?.name || 'Unknown',
            commitMessage: commitDetails.commit.message,
            commitUrl: commitDetails.html_url,
          };
          logChange(changeDetails);
        }
      });
    }
  }
};

export default trackChangesInGitHub;