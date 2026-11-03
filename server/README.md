# Solo Trip — Backend

Modular Express API backed by Neon Postgres.

## Layout

```text
server/
  config/db.js          Neon + external query file logging
  models/               SQL only
  controllers/          HTTP logic
  routes/               URL wiring
  middleware/           logger, 404, errors
  tests/                Vitest + Supertest
  setupDb.js / seed.js  Schema + sample data
```

## Setup

```bash
cp .env.example .env
npm install
npm run setup-db && npm run setup-users && npm run seed
npm run dev
```

## Test

```bash
npm test
npm run test:coverage
```
