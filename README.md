# Solo Trip

Travel companion platform for Arab women — find overlapping trips, connect safely, and share experiences.

## Development environment (§1)

- **Recommended OS:** Linux or macOS (Windows works via WSL2 recommended for course alignment).
- **Stack:** React (Vite) frontend + Node.js/Express API + Neon Postgres.
- **Repo layout:**
  - `client/` — frontend
  - `server/` — backend API
  - `docs/USER_STORIES.md` — Agile user stories / board snapshot
  - `ALL_LICENSES` — third-party licenses
  - `docker-compose.yml` — containerized API

## Quick start

### 1) Server

```bash
cd server
cp .env.example .env   # add your Neon DATABASE_URL
npm install
npm run setup-db
npm run setup-users
npm run seed
npm run dev
```

API: `http://localhost:3001`  
Health: `GET /api/health`

### 2) Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173` (or next free port)

## Git workflow (§2)

- `main` — stable integration branch
- Feature work on branches such as `cursor/...` or `feature/backend` / `feature/frontend`
- Open Pull Requests for review (course Code Review requirement)

## Scripts

| Area | Command | Purpose |
|------|---------|---------|
| server | `npm run dev` | Watch API |
| server | `npm test` / `npm run test:coverage` | Unit/API tests (≥70% thresholds) |
| server | `npm run setup-db` / `setup-users` / `seed` | Neon schema + sample trips |
| client | `npm run dev` / `build` / `lint` | UI |

## Docker (§10)

```bash
# from repo root (requires server/.env with DATABASE_URL)
docker compose up --build
```

Or build the API image only:

```bash
docker build -t solo-trip-api ./server
```

## CI/CD (§11)

GitHub Actions workflow `.github/workflows/ci.yml` runs on PRs/pushes:

1. Server tests + coverage  
2. Client lint + build  
3. Docker image build  

## Security notes (§9)

- Passwords hashed with `bcryptjs` (never stored plain text)
- Input validation on register/login/create trip
- `.env` is gitignored; use `.env.example` templates
- Parameterized SQL via Neon tagged templates

## Logging (§8)

- Console request log for every HTTP call (`requestLogger`)
- External Neon calls appended to `server/logs/external-api.log`
