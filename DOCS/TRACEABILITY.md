# SigmaPay Design-to-Code Traceability

This matrix maps the submitted design artifacts to implementation artifacts that can be inspected during review.

| Design area | Design artifact | Implementation artifact | Verification |
|---|---|---|---|
| Layered architecture | `DOCS/SigmaPay_Updated_ClassDiagram.puml` | `backend-server/src/api/controller.ts`, `backend-server/src/services/services.ts`, `backend-server/src/data/repositories.ts` | Dependency injection is visible in `backend-server/src/server.ts` |
| REST presentation layer | Controller interfaces in the class diagram | `backend-server/src/api/controller.ts` | Routes are mounted under `/api` |
| Persistence/data layer | Data layer diagrams in `DOCS/Data Layer.pdf` | `backend-server/src/config/supabase.ts`, `supabase/schema.sql` | `GET /health` checks the configured Supabase project |
| Domain entities | `backend-server/src/domain/entities.ts` | `supabase/schema.sql` | Entity fields map to quoted PostgreSQL table columns |
| Frontend client | UI and whole-system diagrams | `frontend-client/src/api/apiClient.ts`, `frontend-client/src/pages/` | Frontend calls the backend base URL from `REACT_APP_API_URL` |
| Deployment topology | Whole-system diagram | `docker-compose.yml`, `backend-server/Dockerfile`, `frontend-client/Dockerfile`, `frontend-client/nginx.conf` | `docker compose build` builds both services |
| CI/CD and registry | Delivery requirement | `.github/workflows/ci.yml` | Pull requests build both apps and images; pushes to `main` publish GHCR images |
| Database contract | Supabase schema supplied for the project | `supabase/schema.sql` | Idempotent `create table if not exists` definitions and indexes |

## Runtime flow

1. Nginx serves the React bundle on port `3000`.
2. The browser calls the Express API on port `3001`.
3. Express initializes Supabase using server-only environment variables (Node 22 runtime).
4. `/health` reports the application and Supabase connectivity state.
5. Supabase owns durable data; the SQL schema is the reviewable source of truth.
