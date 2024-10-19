# Fitness App V2

## Summery

This is a monorepo for the Fitness App V2 project..
The app is hosted on vercel and fly.io.

[Live Demo](https://fitness-app-v2-rho.vercel.app)

You can login with the following demo-user:
username: `demo@demo.com`
password: `demo`
To see the app filled with some demo-content.

--- or ---

You can create your own user and login with it.

The app doesn't use any analytics or tracking, there is no email verification, you can use a non-existing email to register(though you can not use one that was already registered), and the passwords are stored as hashed binary data, so you won't be exposing your password in any way.

The app is also using a JWT token as cookie, so the token will be stored in your client for authentication, as stated before no other tracking or analytics are attached to that cookie.

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
- Libraries: ReactQuery, react-router-dom, React Hook Form, TailwindCSS, Shadcn:ui, Vite, Vitest
- Deploy: Vercel

## Prerequisites

- Pnpm package manager [Install](https://pnpm.io/installation)
- Go version 1.2.x [Install](https://go.dev/doc/install)
- Postgres server [Install](https://www.postgresql.org/download/)

## Setup

1. Clone the repo to your local machine.
2. Create a `.env` file in the server directory:

```bash
DATABASE_URL="postgres://postgres:postgres@localhost:5432/fitness_app"
PORT="1323"
JWT_SECRET="This_is_my_secret"
CORS="http://localhost:5173,http://127.0.0.1t:5173"
ENV="development"
CRON_API_KEY="cron_api_ket"

AWS_BUCKET_NAME="your-bucket-name"
AWS_REGION="your-region"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
```

3. Create the client `.env` files, which are `.env.development.local` and `.env.production.local`:

`.env.development.local`:

```bash
VITE_API_URL="http://localhost:1323/api/v1"
VITE_WS_URL="ws://localhost:1323/ws"

CRON_SECRET="cron_secret"
CRON_API_KEY="cron_api_key"
```

`.env.production.local`:

```bash
VITE_API_URL="https://fitness-v2-server.fly.dev/api/v1"
VITE_WS_URL="wss://fitness-v2-server.fly.dev/ws"

CRON_SECRET="cron_secret"
CRON_API_KEY="cron_api_key"
```

4. Install dependencies:

```bash
pnpm run install:all
```

## Development and Deployment

Fork the project, and clone it to your local machine, create a branch off the staging branch to develop your features or fix bugs.

After the feature is complete squash your commit and give your commit a prefix with the relative commit action, the repo is using `semantic-release` to assign a version number and generate a changelog based on the commits. [commit message format](https://github.com/semantic-release/semantic-release?tab=readme-ov-file#commit-message-format)

Create a pull request to the staging branch.

After the staging branch will be tested and merged into the main branch, a release will be triggered - a version will be assigned and a changelog will be generated, the app will also be built and deployed to fly.io and vercel.

fix
