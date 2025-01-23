# VarsGuard

**VarsGuard** is a universal environment variable management solution for Node.js, React, and Vite projects. It ensures your environment variables are:

- **Validated**: Against JSON schemas with advanced rules
- **Synchronized**: Between local environments and deployment secrets
- **Secure**: With policy enforcement and best practice checks
- **Generated**: Automatic `.env.example` creation from code analysis

---

## Features

### 1. **Multi-Platform Support**
   - **Node.js/React**: Traditional `process.env` patterns
   - **Vite**: Full support for `import.meta.env` syntax
   - **Python**: Basic `os.getenv()` detection

### 2. **Smart Generation**
   - Auto-detects Vite projects and applies security rules
   - Generates `.env.example` from codebase scanning
   - Filters Vite's built-in variables (MODE, DEV, PROD)

### 3. **Security Enforcement**
   - Detects hardcoded secrets in source code
   - Validates variable naming conventions
   - Vite-specific client-side exposure checks

### 4. **CI/CD Integration**
   - GitHub Actions workflow examples
   - Secret synchronization validation
   - Policy enforcement gates

---

## Configuration

Create `.varsguardrc` in your project root:

```json
{
  "githubToken": "your_github_token",
  "repo": "owner/repo",
  "schemaPath": "./schema.json",
  "envPath": ".env",
  "envExamplePath": ".env.example",
  "vitePrefix": "VITE_"
}
```

**Vite-Specific Options**:
- `vitePrefix`: Enforce client-safe variable prefix (default: `VITE_`)
- Auto-detects Vite projects (no config needed!)

---

## Installation

```bash
npm install varsguard
```

---

## CLI Commands

### 1. **Initialize Configuration**
```bash
npx varsguard init
```

### 2. **Generate .env.example**
```bash
npx varsguard generate
```
Scans for:
- `process.env.VAR` (Node.js/React)
- `import.meta.env.VAR` (Vite)
- `os.getenv()` (Python)

### 3. **Validate Environment**
```bash
npx varsguard validate [--token GH_TOKEN] [--repo owner/repo]
```
- Checks local vs remote secrets
- Validates against schema.json
- Ensures Vite security rules

## CI/CD Pipeline Example

`.github/workflows/varsguard.yml`:
```yaml
name: Varsguard security check

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
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: |
          npm ci

      - name: Validate Environment Variables
        run: npm run varsguard validate
        env:
          GSL_GITHUB_SECRETS: ${{ toJson(secrets) }}
```

---

## Advanced Validation

Example `schema.json` with Vite support:
```json
{
  "type": "object",
  "properties": {
    "VITE_API_KEY": {
      "type": "string",
      "minLength": 32,
      "description": "Client-side API key"
    },
    "DATABASE_URL": {
      "type": "string",
      "format": "uri"
    }
  },
  "required": ["VITE_API_KEY", "DATABASE_URL"]
}
```

---

## Documentation

- [CHANGELOG](./CHANGELOG.md) - Version history
- [CONTRIBUTING](./CONTRIBUTING.md) - Development guidelines
- [LICENSE](./LICENSE) - MIT License
