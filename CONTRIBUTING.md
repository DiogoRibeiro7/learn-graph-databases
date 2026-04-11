# Contributing to learn-graph-databases

Thank you for helping improve this teaching repository.

## Getting started

1. Fork the repository.
2. Create a feature branch from `develop`, using a descriptive name like `issue-37-add-github-badges`.
3. Install dependencies:

```bash
yarn install
```

4. Copy the sample environment file:

```bash
cp .env.example .env
```

5. Start the local Neo4j service if needed:

```bash
docker compose up -d
```

## Development workflow

- Use `yarn typecheck` to validate TypeScript.
- Use `yarn lint` to check formatting and code quality.
- Use `yarn test` to run the automated test suite.

## Branch and commit guidance

- Keep changes small and focused on one issue at a time.
- Use clear commit messages with a short summary and detail in the body when needed.
- Prefer branch names that reference the issue number and scope.

## Pull requests

- Open a PR against `develop`.
- Reference the issue number in the PR title or description.
- Include a short summary of the change and the testing performed.
- Ensure all tests pass before requesting review.

## Reporting issues

If you find a bug or want to request a feature, please open an issue with:

- a clear summary,
- steps to reproduce,
- expected behavior,
- actual behavior,
- any relevant environment details.
