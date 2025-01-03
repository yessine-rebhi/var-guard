import { generateEnvExample } from '../../src/core/generation.js';
import { vi, expect, describe, it } from 'vitest';
import chalk from 'chalk';
import process from 'process';

describe.only('Policy Violation: Static Environment Variables', () => {
  let consoleErrorSpy;
  let exitSpy;

  beforeEach(() => {
    // Spy on console.error and process.exit to capture their calls
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { });
  });

  it('should detect static environment variables and raise policy violation', async () => {
    const API_KEY ="test";
    // Call the generateEnvExample function
    await generateEnvExample();

    // Assert that the process exits with code 1
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});