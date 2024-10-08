# Fitness App V2

## Summery

This is a monorepo for the Fitness App V2 project..

[Change Log](./CHANGELOG.md)

## Stack

### Server

- Language: Go
- Framework: Echo
- Database: Postgres
- Deploy: Docker containers run on fly.io

### Client

- Language: Javascript(Typescript)
- Framework: React
- Libraries: React Query, React Router, React Hook Form, Tailwind CSS, Vite
- Deploy: Vercel

## Prerequisites

- Pnpm package manager [Install](https://pnpm.io/installation)
- Go version 1.2.x [Install](https://go.dev/doc/install)
- Postgres server [Install](https://www.postgresql.org/download/)

## Setup

1. Clone the repo to your local machine.
2. Create a `.env` file in the server directory:

```bash
# local database url
DATABASE_URL="postgres://postgres:postgres@localhost:5432/fitness_app"
# port to run the server on
PORT="1323"
# jwt secret for your local server
JWT_SECRET="This_is_my_secret"
# cors for your local clients
CORS="http://localhost:5173,http://127.0.0.1t:5173"
# Optional
ENV="development"

# AWS Bucket envs
AWS_BUCKET_NAME="your-bucket-name"
AWS_REGION="your-region"
# AWS IAM user
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
```

3. Create the client `.env` files, which are `.env.development.local` and `.env.production.local`:

`.env.development.local`:

```bash
VITE_API_URL="http://localhost:1323/api/v1"

VITE_WS_URL="ws://localhost:1323/ws"
```

`.env.production.local`:

```bash
VITE_API_URL="https://fitness-v2-server.fly.dev/api/v1"

VITE_WS_URL="wss://fitness-v2-server.fly.dev/ws"
```

4. Install dependencies:

```bash
pnpm run install:all
```

## Development and Deployment

Fork the project, and clone it to your local machine, create a branch off the staging branch to develop your features or fix bugs.

After the feature is complete squash your commit and give your commit a prefix with the relative commit action, the repo is using `semantic-release` to assign a version number and generate a changelog based on the commits. ([commit message format]("https://github.com/semantic-release/semantic-release?tab=readme-ov-file#commit-message-format"))

Create a pull request to the staging branch.

After the staging branch will be tested and merged into the main branch, a release will be triggered - a version will be assigned and a changelog will be generated, the app will also be built and deployed to fly.io and vercel.
