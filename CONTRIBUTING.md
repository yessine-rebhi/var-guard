# Contributing to varsguard

Thank you for considering contributing to varsguard! Your help is greatly appreciated. By participating in this project, you are helping to improve it for everyone.

## How to Contribute

There are several ways you can contribute to this project:

- **Reporting Bugs**: If you encounter any issues, please open an issue on GitHub. Provide a detailed description and steps to reproduce.
- **Suggesting Features**: Feel free to propose new features or improvements. Make sure to describe the use case and why it would be beneficial.
- **Contributing Code**: Contributions are always welcome! You can submit your improvements or bug fixes via pull requests.

## Setting Up the Project

To get started with local development, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yessine-rebhi/varsguard.git
   ```
2. Navigate into the project directory:
   ```bash
   cd repository-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the project locally (optional):
   ```bash
   npm run vangaurd
   ```

This should get you set up and ready to make changes.

## Branching and Commit Guidelines

- Create a new branch for each new feature or bug fix:
  ```bash
  git checkout -b feature/my-feature
  ```
- Commit changes with a clear and concise message. Use the present tense for commit messages, and reference relevant issues (if applicable):
  ```bash
  git commit -m "Fix bug in user login flow"
  ```
- Push your branch to the remote repository:
  ```bash
  git push origin feature/my-feature
  ```

- Open a pull request when your work is ready for review.

## Code Style

Please adhere to the following coding style guidelines:

- Use [Prettier](https://prettier.io/) for formatting.
- Follow [ESLint](https://eslint.org/) rules for linting. Run `npm run lint` to check your code for style violations.

Ensure all tests are passing before submitting your pull request:
```bash
npm test
```

If adding a new feature, please ensure there are tests to cover your changes.

## Pull Request Process

- Ensure your branch is up to date with the `dev` branch:
  ```bash
  git checkout dev
  git pull origin dev
  ```
- Once your changes are ready, open a pull request (PR) from your feature branch to the `dev` branch.
- The project maintainers will review your PR. If required, you will be asked to make revisions.
- After approval, your PR will be merged into `dev`.

If you're unfamiliar with pull requests, check out GitHub's [pull request guide](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By submitting a pull request, you agree that your contributions will be licensed under the [MIT License](LICENSE).
```
