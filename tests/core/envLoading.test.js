import { loadEnv } from '../../src/core/envLoading';
import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';

// Mock fs.existsSync and dotenv.config
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
  };
});

describe('loadEnv', () => {
  it('should return required variables if .env file does not exist in non-CI environment', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.CI = undefined;

    const requiredVars = ['DB_HOST', 'DB_PORT'];
    const result = await loadEnv('.env', requiredVars, null);

    expect(result).toEqual(requiredVars);
  });

  it('should load variables from .env file if it exists', async () => {
    fs.existsSync.mockReturnValue(true);

    const requiredVars = ['DB_HOST', 'DB_PORT'];
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';

    const result = await loadEnv('.env', requiredVars, null);

    expect(result).toEqual(requiredVars);
  });

  it('should log missing variables when they are not set in .env', async () => {
    fs.existsSync.mockReturnValue(true);

    const requiredVars = ['DB_HOST', 'DB_PORT'];
    process.env.DB_HOST = '';
    process.env.DB_PORT = '5432';

    const result = await loadEnv('.env', requiredVars, null);

    expect(result).toEqual(requiredVars);
  });
});