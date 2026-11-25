# PM2 design to code traceability

This PM2 set documents implemented TypeScript service scenarios with object fixtures mirrored in `backend-server/test`. The diagrams describe the repository and service boundaries that exist in this prototype. The proposal's suggested ownership is reflected in Jira as requested; features with no implementation are called out as gaps rather than represented as working behavior.

The proposal is the scope baseline. It describes the running app as a mock prototype with in-memory data and simplified authentication, and says provider dependent functions must remain mock or unavailable until configured. The diagrams and UI follow those boundaries; they do not imply live banking, market data, or payments.

| PM2 artifact | Implementation mapping | Verification mapping |
| --- | --- | --- |
| Updated service class diagram | `system-service-classes.puml`; service, repository interfaces, repository implementations and entity types in `backend-server/src` | Scenario tests listed below exercise the modeled links |
| Account object, sequence and communication diagrams | `account-*.puml`; `AccountService` and its account repository interfaces | `backend-server/test/account-scenario.test.ts` checks save and lookup calls |
| Budget object, sequence and communication diagrams | `budget-*.puml`; `BudgetService`, `IBudgetRepository`, `ITransactionRepository` | `backend-server/test/budget-scenario.test.ts` checks ordered find/save interactions and resulting totals |
| Goal object, sequence and communication diagrams | `goal-*.puml`; `GoalService` and `IGoalRepository` | `backend-server/test/goal-scenario.test.ts` checks find/save interaction and completion state |
| Group savings object, sequence and communication diagrams | `group-savings-*.puml`; React page, API client, controller, service, repository and entities | `backend-server/test/group-savings.test.ts` uses group G-104 and verifies ordered repository calls |
| Investment strategy object, sequence and communication diagrams | `investment-*.puml`; `createFeatureHubRouter` and injectable `InvestmentStrategyStore` in `backend-server/src/api/featureHub.ts` | `backend-server/test/feature-hub-scenario.test.ts` uses a spy store to verify save/get interactions and rejects unknown options |
| Notification alert object, sequence and communication diagrams | `notification-*.puml`; `NotificationServiceBL` and `INotificationRepository` | `backend-server/test/notification-scenario.test.ts` checks the alert fixture and save/find calls |
| Payment object, sequence, communication and state diagrams | `payment-*.puml`; `PaymentsServiceBL` and `IPaymentRepository` | `backend-server/test/payment-state.test.ts` checks valid and invalid transitions plus repository calls |
| Goal state diagram | `goal-state.puml`; `GoalService.contributeToGoal` | `goal-scenario.test.ts` verifies Active to Completed at the target amount |
| CI coverage | `.github/workflows/ci.yml`; `backend-server/package.json` | TypeScript service tests run via Node test and `c8`; latest local result is recorded in the delivery summary, not as a hosted Actions result |
| GitHub Actions | `.github/workflows/ci.yml` | `npm test` builds and runs 13 Node tests with `c8`; frontend build and Docker image builds remain in validation |
| SonarQube | `sonar-project.properties`, CI SonarQube job | Configure repository secret `SONAR_TOKEN` and variable `SONAR_HOST_URL`; quality gate runs after scan |
| Jenkins | Root `Jenkinsfile` | Configure Jenkins NodeJS tool `Node 22`, SonarQube installation `SigmaPay SonarQube`, and scanner on PATH |
| Sprint plan and burndown | `A:\CS Study\7th Sem\Advanced\SigmaPay_SprintPlan_and_Burndown.xlsx` | Jira board: [SCRUM backlog](https://aiu-team-jkoscu8b.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog) |
| Jira burndown reconstruction | `DOCS/PM2/sprint0-burndown-jira-derived.svg`; attached to [SCRUM-47](https://aiu-team-jkoscu8b.atlassian.net/browse/SCRUM-47); Sprint 0 issue history for SCRUM-18, SCRUM-20, SCRUM-22 | Derived chart is based on Jira dates and issue transitions; it is not the native Jira screenshot |

The last local `npm test` run passed 13/13 TypeScript tests. `c8` reported 63.83% statement and line coverage, 89.41% branch coverage, and 52.80% function coverage across the service and feature hub files. This is local evidence; the hosted check remains the source for CI status.

## Language and test framework decision

The deployed backend is TypeScript/Node.js. The team explicitly accepts TypeScript unit tests and rejects JUnit for this project. The committed `.test.ts` files use Node's built in test runner through `tsx` and repository spies, so they exercise the TypeScript services and verify the interactions modeled by the communication diagrams. Coverage is collected by `c8`.

## Remaining PM2 evidence

- The proposal includes investment, advisory, cards, offers, tutoring, notification, and banker/operator scope that is not fully implemented in the current backend. Those proposed scenarios still need implementation or a clearly labeled design-only deliverable and team review before they can be claimed as verified.
- Configure SonarQube secrets and verify the quality gate result in a live pipeline.
- Jenkins still needs a configured controller, tools, credentials, and a successful run.
- The M2 brief requires an object, sequence, and communication diagram for one service scenario per member. Five implemented backend scenarios are modeled here, but the proposal’s five member ownership allocation is still proposed, and some owner services have no backend implementation. The team must map/confirm one scenario per member before claiming this item complete.
- The five representative scenarios and Jira story assignees follow the proposal's suggested assignments per the user's direction: account (Ammar), budget (Mohammed Eslam), group savings (Omar), investment options (Andrew), and notifications (Mohamed Ibrahim). US23 is assigned to Ammar and US24 to Mohammed Eslam per FR13 and FR14. The proposal still labels assignments provisional; do not claim broader team consensus unless the team confirms it.
- The proposal's cards, offers, tutoring, advisory, banking connections, and admin oversight are incomplete or unavailable in the prototype. Do not represent those as live integrations or mark their Jira stories done based only on the UI placeholders.
- Jira SCRUM-47 tracks remaining course evidence and review. The issue remains in the backlog with no sprint assignment or invented points until the team plans it.
- Jira tracks the remaining PM2 cross-cutting work in SCRUM-47. Jira records Sprint 0 as Active despite its ended date; confirm acceptance with the team before closing it, and preserve issue history. Sprint 1 is Future with the proposal scope US6, US9 and US24 (13 points); its goal is set, while dates remain blank pending capacity and schedule agreement.
