# PM2 DevOps notes

## GitHub Actions and Jenkins comparison

| GitHub Actions | Jenkins |
| --- | --- |
| Hosted runners and workflow YAML live in `.github/workflows/ci.yml` | A controller and build agents must be operated by the team; `Jenkinsfile` lives in the repository |
| GitHub provides repository event triggers and `GITHUB_TOKEN` for package publishing | Configure webhooks and credential `ghcr` with a GitHub account token that can publish packages |
| SonarQube scan and quality gate run when `SONAR_HOST_URL` repository variable and `SONAR_TOKEN` secret are set | Configure Jenkins SonarQube installation and scanner, then enforce the quality gate through the server webhook and `waitForQualityGate` |
| Publishes backend and frontend images to GHCR on `main` | Publishes matching backend and frontend image tags to GHCR on the `main` branch |
| Build logs and artifacts are attached to workflow runs | Logs and archived coverage are stored by the Jenkins controller |
| Lower maintenance for this public GitHub project | More control over agents and environment, with operational maintenance cost |

Both pipelines use Node 22, build the TypeScript backend, execute tests with `c8`, build the React app, and publish backend/frontend images from the main branch. When SonarQube is configured, both wait for the quality gate before publishing. GitHub Actions uses repository variable `SONAR_HOST_URL`; Jenkins uses build variable `SONAR_ENABLED=true`. If SonarQube is not configured, both skip the scan and allow publishing after validation. The Jenkins pipeline needs the NodeJS plugin tool named `Node 22`, a SonarQube server named `SigmaPay SonarQube`, the scanner on PATH, a SonarQube webhook for `waitForQualityGate`, and Jenkins username/password credential `ghcr` for an account that can push to GHCR.

## Test framework alignment

The team accepts TypeScript unit tests and does not want JUnit. Tests in `backend-server/test` are TypeScript files using Node's built in runner through `tsx`, with repository spies against the TypeScript services. They cover account lookup, budget expenses, goal completion, group savings, investment strategy storage, notification alerts, and valid and invalid payment state transitions. Run with `cd backend-server && npm test`.

## Configure SonarQube

1. Set repository variable `SONAR_HOST_URL` to the team's SonarQube server.
2. Add secret `SONAR_TOKEN` with a project analysis token.
3. Configure the project quality gate on the SonarQube server.
4. Verify a pull request run fails when the quality gate fails.

Until the server and credentials exist, no passing SonarQube quality gate can be claimed. GitHub Actions skips the SonarQube job unless `SONAR_HOST_URL` is configured, then requires `SONAR_TOKEN` and enforces the returned gate. Jenkins waits for its SonarQube webhook. The Jenkinsfile uses Windows `bat` steps and therefore needs a Windows agent; change its shell steps if the team uses Linux agents.

## Hosted pull-request validation

PR [#9](https://github.com/Ammar-M-Eid/Sigma-Pay/pull/9) includes the M2 implementation. GitHub Actions run [45649665792](https://github.com/Ammar-M-Eid/Sigma-Pay/actions/runs/45649665792) passed its validation job for commit 78c7f86 on 2026-11-25. The SonarQube job was skipped because SONAR_HOST_URL is not configured; the image publishing job was skipped because this was a pull request. Configure the SonarQube URL and token to produce hosted quality-gate evidence.
