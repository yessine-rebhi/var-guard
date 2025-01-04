import { generateEnvExample } from '../../src/core/generation.js';
import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const mockPath = '/mock/path';

describe('Policy Violation: Static Environment Variables', () => {
  let consoleErrorSpy;
  let exitSpy;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { });

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    // Mock fs.readdirSync to simulate files in the directory
    vi.spyOn(fs, 'readdirSync').mockImplementation((dirPath) => {
      if (dirPath === mockPath) {
        return ['violation.js'];
      }
      throw new Error(`Directory not found: ${dirPath}`);
    });

    // Mock fs.readFileSync for the sample violation.js file
    vi.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
      if (filePath.endsWith('violation.js')) {
        return 'const API_KEY = "test";';
      }
      return '';
    });

    vi.spyOn(path, 'resolve').mockImplementation((...args) => args.join('/'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect static environment variables and raise policy violation', async () => {
    vi.mock('../../src/utils/loadConfig.js', () => ({
      loadConfig: () => ({ envExamplePath: '.env.example' }),
    }));

    await generateEnvExample();

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Policy Violation: Static environment variables found!')
    );
  });
});