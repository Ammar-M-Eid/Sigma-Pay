# SigmaPay

SigmaPay is a React and TypeScript personal finance demo with an Express API.
It runs locally without Supabase credentials or a database.

## Run with Docker Compose

Requirements: Docker Desktop (or Docker Engine) with Compose enabled.

From the repository root:

```sh
docker compose up --build
```

Open <http://localhost:3000>. The API gateway is at `http://localhost:3001` and its
health endpoint is <http://localhost:3001/health>. It routes the existing API contract
to these domain services:

| Service | API routes |
| --- | --- |
| Identity | `/api/accounts/*` |
| Finance | `/api/budgets/*`, `/api/goals/*`, `/api/reports/*` |
| Savings | `/api/groups/*` |
| Payments | `/api/payments/*` |
| Notifications | `/api/notifications/*` |

Each service is a separate container using the same backend image, with an Nginx API
gateway in front. The frontend keeps its existing API URL and route contract.

Check service status with `docker compose ps`. Stop and remove the containers with
`docker compose down`.

The Compose stack deliberately does not pass `.env` into the services. The current
Supabase client is not connected to repositories; adding credentials cannot enable
persistence. Never commit `.env` or put server credentials in frontend configuration.

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

- The identity API implements registration and login. Passwords are stored as salted
  scrypt hashes, but users live only for that identity container's lifetime; there are
  no production sessions or external authentication provider in this demo. Registration
  requires a 3–20 character username, valid email, phone with at least 10 digits, and a
  password of at least 8 characters containing uppercase, lowercase, and a number.
- `POST /api/accounts/demo-login` enters a fixed, clearly labeled `demo-user` profile
  without a password. It is only for local demonstration; registration and password login
  remain separate API flows.
- API repositories are in memory. Data is temporary and disappears when its service restarts.
- Each domain service has its own process-local store. Data is not shared between services,
  and reports only see transactions created inside the finance service.
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
