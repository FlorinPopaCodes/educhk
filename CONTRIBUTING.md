# Contributing to educhk

Thanks for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies:

```bash
pnpm install
```

## Development

This is a monorepo managed with pnpm workspaces:

```
packages/educhk/    # npm package (the library)
worker/             # Cloudflare Worker (live API)
scripts/            # Data sync from JetBrains Swot
```

### Common Commands

```bash
pnpm sync           # Pull latest Swot data and generate JSON files
pnpm build          # Build the npm package
pnpm test           # Run worker tests
pnpm deploy         # Deploy the Cloudflare Worker
```

## Submitting Changes

1. Create a new branch for your feature or fix
2. Make your changes
3. Ensure tests pass with `pnpm test`
4. Submit a pull request with a clear description of the changes

## Domain Data

The academic domain data is sourced from [JetBrains Swot](https://github.com/JetBrains/swot) and synced daily via GitHub Actions. If you want to add or update academic domains, please contribute upstream to the Swot repository.

## Reporting Issues

If you find a bug or have a feature request, please open a GitHub issue with:

- A clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
