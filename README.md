# A Demo Fullstack app for Nextjs + Apollo GraphQL

## Get started

1. Run the following command:

```sh
npm install
```

2. Set up .env files in both `apps/web/.env` and `apps/server/.env`

3. start dev server

```sh
npm run dev
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `server`: a Apollo GraphQL server for proxing API
- `web`: A nextjs app for frontend
- `@repo/graphql`: A GraphQL schema package
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```sh
npm run build
```
