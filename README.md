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

## Deploy

### Client Deploy

Merging a branch to main will deploy the client to vercel.

### Server Deploy

```bash
cd Fitness-v2-server && fly deploy
```

## Current DB structure & permissions

![Database Structure](./assets/001.png)

testing graphite
