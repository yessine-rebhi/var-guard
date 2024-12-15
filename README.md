# EnvGuard

EnvGuard is a Node.js library designed to streamline and secure the management of environment variables in modern software development. It ensures that all your environment variables are:

- **Validated**: Based on schemas with advanced rules.
- **Synchronized**: Between local environments and deployment secrets (e.g., GitHub, cloud providers).
- **Audited**: Tracks changes for traceability and collaboration.
- **Secure**: Warns against insecure practices and integrates seamlessly with secret managers.

---

## Features

1. **Validation**
   - Validate environment variables using a schema (`schema.json`).
   - Support for common formats like `email`, `uri`, and `uuid`.
2. **Synchronization**
   - Compare local `.env` variables with deployment secrets (e.g., GitHub Secrets).
3. **Auditing**
   - Tracks and logs changes in environment variables.
   - Audit GitHub commits to detect changes in `.env` and `schema.json` files.
4. **Security**
   - Identifies missing or unused variables.
   - Warns against insecure configurations.

---

## Installation

```bash
npm install envguard
```

---

## Usage

### 1. Import EnvGuard

EnvGuard provides services for validating, synchronizing, and auditing environment variables.

```javascript
import { loadEnv, validateEnv, fetchGitHubSecrets, compareSecrets, trackChangesInGitHub } from 'envguard';
```

### 2. Example Usage

#### Validation Example

```javascript
import { validateEnv } from 'envguard';

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
import { loadEnv, fetchGitHubSecrets, compareSecrets } from 'envguard';

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

#### Auditing Example

```javascript
import { trackChangesInGitHub } from 'envguard';

const token = 'your_github_token';
const repo = 'your_username/your_repo';

try {
  await trackChangesInGitHub(token, repo);
  console.log('Audit completed successfully!');
} catch (error) {
  console.error(`Audit failed: ${error.message}`);
}
```

---

## API

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

### 5. `trackChangesInGitHub(token, repo)`

Tracks changes in `.env` and `schema.json` files in GitHub commits.

- **token**: GitHub personal access token.
- **repo**: Repository name in `owner/repo` format.

---

## Running the Library

### 1. Setup

1. Create `.env` and `.env.example` files in your project.
2. (Optional) Create a `schema.json` for advanced validation.

Example `.env.example`:

```env
DATABASE_URL=
PORT=3000
API_KEY=
```

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

### 2. Run the Library

Create a Node.js file (e.g., `index.js`) and use EnvGuard.

```bash
node index.js
```

### 3. Test the Endpoints (if using the example server)

Start the server:

```bash
node src/app.js
```

Test the validation endpoint:

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"token": "your_github_token", "repo": "your_username/your_repo"}'
```

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

