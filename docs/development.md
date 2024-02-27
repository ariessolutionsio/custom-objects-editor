---
layout: default
title: Development
nav_order: 3
---

<!--prettier-ignore-start-->
## Development
{: .no_toc }

1. TOC 
{:toc}

<!--prettier-ignore-end-->

### Technology

- [ReactJS](https://reactjs.org/)
- [Apollo](https://www.apollographql.com/docs/react/) &
  [GraphQL](https://graphql.org/learn/)
- [Merchant Center Application Kit](https://docs.commercetools.com/custom-applications/)
- [UI Kit](https://uikit.commercetools.com/?path=/story/introduction--getting-started) -
  Merchant Center component library
- [Yarn](https://classic.yarnpkg.com/en/docs/getting-started) - Package manager
- [Jest](https://jestjs.io/docs/en/getting-started) - Test runner
- [Enzyme](https://enzymejs.github.io/enzyme/) - React testing utility
- [Prettier](https://prettier.io/docs/en/index.html) - Code formatter
- [ESLint](https://eslint.org/docs/user-guide/getting-started) - JS, CSS, and
  GraphQL linter


### Installation

Clone the repository.

Simply run `yarn` or `yarn install` from the repository root to install the
application's dependencies.

```bash
yarn
```
If this is the first time running the application locally, create an `env.json`
file at the root directory using `env.local.json` as an example. Based on your
[region](https://docs.commercetools.com/api/general-concepts#regions), you may find it
necessary to modify the values of `frontendHost`, `mcApiUrl`, and `location`.

Run the following command to start the development server and launch the
application:

```bash
yarn start
```

### Build

Run the following command to build the
[production bundles](https://docs.commercetools.com/custom-applications/development/going-to-production#building-production-bundles)
with webpack:

```bash
yarn build
```

### Linting & Formatting

#### Formatting code

Run the following command to format JS, CSS, JSON and GraphQL files

```shell
yarn format
```

#### Linting code

Run the following command to lint JS, CSS, and GraphQL files

```shell
yarn lint
```

<!--prettier-ignore-start-->
##### Linting GraphQL Queries
{: .no_toc }
<!--prettier-ignore-end-->

A prerequisite for linting GraphQL queries is generating a `schema.graphql`
file, which contains the Types exposed by CTP API. Every time the API introduces
new Types, Queries or Mutations, the local `schema.graphql` must be updated.

<!--prettier-ignore-start-->
##### Generating CTP GraphQL schema
{: .no_toc }
<!--prettier-ignore-end-->

1. If you haven't done so already, create an API client under
   `Settings -> Developer Settings` in Merchant Center for your project
2. Generate an access token using the
   [Client Credentials flow](https://docs.commercetools.com/tutorials/mobile-spa#creating-a-regular-token-with-the-client-credentials-flow)
3. Export both your Merchant Center project key and generated access token as
   environment variables
4. Retrieve schema with `graphql-cli`

```shell
export PROJECT_KEY={project_key}
export AUTH_TOKEN={access_token}
npx graphql-cli get-schema
```

### Git Hooks

Git hooks are configured using
[Husky](https://github.com/typicode/husky/blob/master/DOCS.md).

- **Pre-commit**: JS, CSS, and GraphQL files are linted (ESLint/Stylelint) and
  formatted (Prettier). Fixes are automatically added to Git.
- **Commit Message**: Commit messages are linted against the
  [conventional commit format](https://www.conventionalcommits.org) using
  commitlint

## Tests

Run the following command to run the tests:

```shell
yarn test
```

To run the tests in watch mode:

```shell
yarn test:watch
```

To run the tests with coverage:

```shell
yarn test:coverage
```
