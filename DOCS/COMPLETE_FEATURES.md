# SigmaPay feature status

SigmaPay runs as a **local demonstration** of the personal-finance workflows in the project requirements. Its front end and API cover the main user flows, but the application is not a production banking service and does not persist data to Supabase.

## Local workflows

| Requirement area | Available in the local demo | Boundary |
| --- | --- | --- |
| Account access | Register, password sign-in, demo sign-in, profile edit, username and password changes, two-step toggle, sample identity check, login activity | Users and settings exist in the identity service's memory. Two-step and identity checks are simulated; there is no production session or identity vendor. |
| Budgets | Create dated plans with categories, record expenses and income, view category totals, check threshold alerts | The finance service stores activity in process memory. |
| Goals | Set target, deadline and priority; contribute; view progress; request a planning suggestion | Suggestions are deterministic sample guidance, not an AI service or investment advice. |
| Group savings | Create a group, add members, record contributions and request a group report | Demo group data lives only in the savings service process. Group membership is not an invite or payment system. |
| Reports | Generate activity, income and spending reports over optional dates; download CSV | Reports include only transactions recorded in the finance service during its current run. |
| Bills and payments | Create and review bills, mark a bill paid in the sandbox, record payment events, verify a sample method, request full refunds, schedule or cancel recurring payments | No real funds move. Recurring payments are stored schedules; this demo does not execute them or connect to a payment processor. |
| Notifications | View local alerts, create a reminder, set session preferences | No email, SMS, push, or external notification delivery is configured. |

## Service layout

Docker Compose starts five domain API services, an Nginx API gateway, and the React front end. Each domain service uses the same layered Express application but accepts requests only for its route family. Each container owns its own in-memory repositories, so there is no shared storage between containers and restarting a service clears its data.

## Supabase and credentials

Supabase/Postgres configuration is not wired to the repositories. The application reports `database: memory` and does not use `.env` credentials. The previously shared database and Supabase credentials should be treated as exposed and rotated by the Supabase project owner; this repository cannot rotate them.

## Build and run

From the repository root:

```sh
docker compose up --build
```

Open `http://localhost:3000`; check the API gateway at `http://localhost:3001/health`. See [README.md](../README.md) for a non-Docker setup.

Build commands:

```sh
cd backend-server && npm ci && npm run build
cd ../frontend-client && npm ci && npm run build
```
