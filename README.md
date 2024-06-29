# Word Impostor

## Used Technologies

Within the project, several technologies are used:

- **PNPM** to manage packages and the monorepo
- **Husky** to enhance GIT hooks
- **Commitlint** to maintain a commit convention
- **Lintstaged** to run linting commands before each commit
- **ESLint** as a linter
- **Prettier** as a code formatter
- **TypeScript** to extend JavaScript with types
- **Fastify** as the web framework for the server
- **Vite + React** to create the Web application
- **Tailwind** for styling the web application

## Prerequisities

To get started with the Word Impostor project, you need to have the following programs installed:

- **Node.js** v20 or higher
- **PNPM** installed globally

## Project Structure

The project structure follows the monorepo strategy, managed through PNPM workspaces. There are:

- The frontend application located in `apps/webapp`
- The server, located in `apps/server`
- A project containing common resources, located in `packages/common`

## Local Development

Both applications are built to be run locally, both with hot-reload enabled.
To develop on your own machine, you first need to run these scripts from the root of the project:

1.  `pnpm install`
2.  `pnpm run build`

### Frontend

To run the frontend application, you need to navigate to the `apps/webapp` folder and run the command `pnpm run dev`.

### Backend

To run the backend application, you need to navigate to the `apps/server` folder and run the command `pnpm run dev`.

### Commit Good Practice

To maintain a certain level of quality, the repository follows conventions as much as possible, both in the code and in the commit messages.

With each commit, thanks to lintstaged, the code passes through ESLint and Prettier:

- If the errors and warnings can be automatically fixed, they will be fixed, and the commit will proceed as usual
- If the errors cannot be automatically resolved, the commit will be canceled, and the user will be notified of the problem

Moreover, commit messages must follow the Conventional [Commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/).

## Repository Structures

There are three main branches in this repository:

- `main`, the primary branch used as the source for creating new branches and adding new code
- `staging`, the branch used to deploy both applications to their respective testing hosts
- `release`, the branch used to deploy both applications to their respective production hosts

## How To Make A Change

For any changes in the repository, a specific workflow must be followed:

1.  Download the repository and create a new branch from `main`
2.  Make as many commits as you want in your personal branch
3.  Open a new PR to merge your personal branch into `main`
4.  Wait for the GitHub actions to be verified
5.  Confirm the merge of your personal branch into `main`

Though, these workflow will not deploy any new version.

## Deployment Workflow

To release a new version of the application, you must go from the `main` branch to the `staging` branch, and then to the `release` branch. The steps to follow are:

1.  Create a PR to merge `main` into `staging`
2.  Wait for the GitHub actions to be verified
3.  Confirm the merge from `main` into `staging`
4.  Once the merge is done, the **Deploy Staging** action will be triggered, which will deploy the two applications to the staging environment
5.  Perform further manual tests using the application in the staging environment
6.  Repeat the operation by merging the `staging` branch into the `release` branch
