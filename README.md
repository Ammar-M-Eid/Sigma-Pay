# SigmaPay

SigmaPay is a React and TypeScript personal finance demo with an Express API.
It runs locally without Supabase credentials or a database.

## Run with Docker Compose

Requirements: Docker Desktop (or Docker Engine) with Compose enabled.

From the repository root:

```sh
docker compose up --build
```

Open <http://localhost:3000>. The API health endpoint is <http://localhost:3001/health>.
To stop the services, press `Ctrl+C`; to remove the containers, run `docker compose down`.

The Compose file uses local demo defaults. Copy `.env.example` to `.env` only if you
want to override those defaults. Never commit `.env` or put server credentials in
frontend configuration.

## Run without Docker

Install Node.js 20 or newer, then open two terminals at the repository root.

Terminal 1, start the API:

```sh
cd backend-server
npm ci
npm run dev
```

Terminal 2, start the website:

```sh
cd frontend-client
npm ci
npm start
```

Open <http://localhost:3000>; check the API at <http://localhost:3001/health>.
The React development server reads `REACT_APP_API_URL` from
`frontend-client/.env`; it defaults to `http://localhost:3001`.

## Demo mode and current limits

- Sign-in is a mock flow; any valid email and password with at least six characters works.
- API repositories are in memory. Data is temporary and disappears when the backend restarts.
- Supabase and Postgres variables are placeholders for future work. The application
  currently does not save application data to Supabase, even when those variables are set.
- Payments, identity checks, notifications and account actions are demonstrations,
  not production financial services.

## Build locally

```sh
cd backend-server
npm ci
npm run build

cd ../frontend-client
npm ci
npm run build
```

The architecture and design-to-code mapping are documented in `DOCS/TRACEABILITY.md`.
