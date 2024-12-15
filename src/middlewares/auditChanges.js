import { trackChangesInGitHub } from '../audit/githubIntegration.js';

const auditChanges = async (req, res) => {
  try {
    const { token, repo } = req.body;

    // Track changes from GitHub
    await trackChangesInGitHub(token, repo);

    res.status(200).send({ message: 'Audit completed successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export default auditChanges;
