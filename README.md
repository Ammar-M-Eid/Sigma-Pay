# SigmaPay

SigmaPay is a React/TypeScript personal-finance application with an Express backend and Supabase persistence configuration.

## Run the complete system

1. Copy `.env.example` to `.env` and fill in the Supabase values. Keep `.env` uncommitted.
2. Apply `supabase/schema.sql` in the Supabase SQL Editor.
3. Run `docker compose up --build`.
4. Open <http://localhost:3000>. The API health endpoint is <http://localhost:3001/health>.

The backend uses `SUPABASE_SECRET_KEY` only on the server. The frontend receives only `REACT_APP_API_URL`.

## Development

```bash
cd backend-server && npm ci && npm run build
cd ../frontend-client && npm ci && npm run build
```

The deployment and design-to-code mapping are documented in `DOCS/TRACEABILITY.md`.
