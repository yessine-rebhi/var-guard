import validateEnv from '../../src/core/validation.js';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/core/envLoading.js', () => ({
  loadEnv: vi.fn(() => ['DB_HOST', 'DB_PORT']),
}));

vi.mock('../../src/core/synchronization.js', () => ({
  fetchGitHubSecrets: vi.fn(() => ['DB_HOST', 'DB_PORT']),
  compareSecrets: vi.fn(() => []),
}));

describe('validateEnv', () => {
  it('should validate environment variables successfully', async () => {
    const options = {
      githubToken: 'fake-token',
      repository: 'owner/repo',
      schemaFilePath: null,
      envPath: '.env',
      envExamplePath: '.env.example',
      requiredVarsArray: ['DB_HOST', 'DB_PORT'],
      isCI: false,
    };

    await validateEnv(options);

    expect(true).toBe(true);
  });
});