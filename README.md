# VarsGuard

**VarsGuard** is a Node.js library designed to streamline and secure the management of environment variables in modern software development. It ensures that all your environment variables are:

- **Validated**: Based on schemas with advanced rules.
- **Synchronized**: Between local environments and deployment secrets.
- **Audited**: Tracks changes for traceability and collaboration.
- **Secure**: Warns against insecure practices and integrates seamlessly with secret managers.
- **Generated**: Automatically generates the `.env.example` file from your codebase.

---

## Features

1. **Validation**

   - Validate environment variables using a schema (`schema.json`).
   - Support for common formats like `email`, `uri`, and `uuid`.

2. **Synchronization**

   - Compare local `.env` variables with deployment secrets (e.g., GitHub Secrets).

3. **Security**

   - Identifies missing or unused variables.
   - Warns against insecure configurations.

4. **Generate ****`.env.example`**

   - Automatically generates a `.env.example` file by scanning your codebase for `process.env` variables.

---

## Configuration

VarsGuard supports a configuration file `.varsguardrc` in the project root directory. This file allows you to set default values for various options. Here's an example:

```json
{
  "githubToken": "your_github_token",
  "repo": "your_username/your_repo",
  "schemaPath": false, // or specify the schemaPath (example: schema.json)
  "envPath": ".env",
  "envExamplePath": ".env.example"
}
```
## Installation

```bash
npm install varsguard
```

---

## CLI Usage

VarsGuard includes a CLI interface for flexible integration into your workflows.

### Commands

#### 1. `varsguard init`

Generate a default `.varsguardrc` configuration file in the project directory.

**Usage:**

```bash
npx varsguard init
```

#### 2. `npm run varsguard generate`

Generates a `.env.example` file by scanning your codebase for references to `process.env.VARIABLE_NAME`.

#### 3. `npm varsguard validate`

Validates the `.env` file against a `.env.example` and/or `schema.json` file, and compares local variables with GitHub secrets.

Options:

- `--token`: GitHub token
- `--repo`: GitHub repository in `owner/repo` format
- `--schemaPath`: Path to schema.json (default: `./schema.json`)
- `--help`: Show help

Example:

```bash
npx varsguard validate --token your_github_token --repo your_username/your_repo --schemaPath ./path/to/schema.json
```

## Library Usage

### 1. Import VarsGuard

VarsGuard provides services for validating, synchronizing, auditing, and generating `.env.example` files.

```javascript
import { loadEnv, validateEnv, fetchGitHubSecrets, compareSecrets, generateEnvExample } from 'varsguard';
```

### 2. Example Usage

#### Validation Example

```javascript
import { validateEnv } from 'varsguard';

const envVars = process.env;
const schemaPath = './schema.json';

try {
  validateEnv(envVars, schemaPath);
  console.log('Environment variables are valid!');
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
}
```

#### Synchronization Example

```javascript
import { loadEnv, fetchGitHubSecrets, compareSecrets } from 'varsguard';

const token = 'your_github_token';
const repo = 'your_username/your_repo';

const localVars = loadEnv('.env', '.env.example');
const githubSecrets = await fetchGitHubSecrets(token, repo);

const missingSecrets = compareSecrets(localVars, githubSecrets);
if (missingSecrets.length) {
  console.log('Missing secrets in GitHub:', missingSecrets);
} else {
  console.log('Local and GitHub secrets are synchronized!');
}
```

#### Generate `.env.example` Example

```javascript
import { generateEnvExample } from 'varsguard';

generateEnvExample();
```

This command will scan your codebase for any references to `process.env.VARIABLE_NAME`, then generate a `.env.example` file in the root of your project. This file will include all the required environment variables, allowing you to easily share it with your team or for use in CI/CD pipelines.

---

## Services

### 1. `loadEnv(envPath, examplePath)`

Loads and validates environment variables against `.env.example`.

- **envPath**: Path to the `.env` file.
- **examplePath**: Path to the `.env.example` file.

### 2. `validateEnv(envVars, schemaPath)`

Validates environment variables against a JSON schema.

- **envVars**: Environment variables object (e.g., `process.env`).
- **schemaPath**: Path to the schema file.

### 3. `fetchGitHubSecrets(token, repo)`

Fetches secrets from a GitHub repository.

- **token**: GitHub personal access token.
- **repo**: Repository name in `owner/repo` format.

### 4. `compareSecrets(localVars, githubSecrets)`

Compares local variables with GitHub secrets.

- **localVars**: Local environment variables object.
- **githubSecrets**: Secrets fetched from GitHub.

### 5. `generateEnvExample()`

Generates a `.env.example` file by scanning your codebase for references to `process.env`. The file will include all environment variables that should be configured for the project.

---

## Running the Library

### 1. Setup

1. Create `.env` and `.env.example` files in your project.
2. (Optional) Create a `schema.json` for advanced validation.

Example `schema.json`:

```json
{
  "type": "object",
  "properties": {
    "DATABASE_URL": { "type": "string", "format": "uri" },
    "PORT": { "type": "integer" },
    "API_KEY": { "type": "string" }
  },
  "required": ["DATABASE_URL", "PORT", "API_KEY"]
}
```

### 2. Run in CI/CD Pipeline

For **GitHub Actions**, you can automatically access the GitHub token and repository name directly from the GitHub environment. Here’s how to set up the CI/CD pipeline:

```yaml
name: EnvGuard CI/CD Pipeline

on:
  push:
    branches:
      - dev
  pull_request:
    branches:
      - dev

jobs:
  validate-env:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          npm install

      - name: Validate Environment Variables
        run: npm run varsguard validate
        env:
          GSL_GITHUB_SECRETS: ${{ toJson(secrets) }}
```
## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed changes between versions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.