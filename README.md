# SigmaPay

SigmaPay is a React/TypeScript personal-finance application with an Express backend and Supabase persistence configuration.

## Run the complete system

1. Copy `.env.example` to `.env` **at the repository root** and fill in the Supabase values. Keep `.env` uncommitted. Docker Compose reads this file for the backend and frontend API URL.
2. Apply `supabase/schema.sql` in the Supabase SQL Editor.
3. Run `docker compose up --build`.
4. Open <http://localhost:3000>. The API health endpoint is <http://localhost:3001/health>.

The backend uses `SUPABASE_SECRET_KEY` only on the server. The frontend receives only `REACT_APP_API_URL`.

### Environment variables

Put these in `Sigma-Pay/.env` (next to `docker-compose.yml`):

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`: Supabase project credentials.
- `DATABASE_URL`, `DIRECT_URL`: Supabase pooled and direct Postgres connection strings.
- `PORT`: backend port, normally `3001`.
- `CORS_ORIGIN`: browser origin, normally `http://localhost:3000`.
- `REACT_APP_API_URL`: frontend API URL, normally `http://localhost:3001`.
- `COOKIE_SECURE`: use `false` for local HTTP; set `true` behind HTTPS.

For frontend-only development, put `REACT_APP_API_URL=http://localhost:3001` in `frontend-client/.env`, then run `npm start` from `frontend-client`.

## Development

```bash
cd backend-server && npm ci && npm run build
cd ../frontend-client && npm ci && npm run build
```

The deployment and design-to-code mapping are documented in `DOCS/TRACEABILITY.md`.
