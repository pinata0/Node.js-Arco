# Project Arco Backend

The Project Arco Backend uses Node.js, TypeScript, Express, PostgreSQL, and pnpm.

## PostgreSQL

From the repository root, start the local database:

```bash
docker compose up -d
```

Copy `.env.example` to `.env` and adjust local values if needed.

## Development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm lint
pnpm build
pnpm start
```

Health endpoints:

- `GET /health`
- `GET /health/db`
