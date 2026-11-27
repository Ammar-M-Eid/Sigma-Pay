# SigmaPay Test Report

This report records the TypeScript service tests, their case identifiers, local results, coverage, and the corresponding GitHub Actions run. The supplied CSE454 test-report document defines the submission format; it does not provide the project’s functional-requirement specification. The requirement areas below therefore describe the implemented behavior under test and do not claim complete coverage of every proposal requirement.

## 1. Requirements under test

| Service / area | Behavior verified | Relevant case IDs |
| --- | --- | --- |
| Account records | Account lookup, missing-account result, repository save and delete delegation | TC-ACCOUNT-001–002 |
| Identity and login activity | Registration validation and normalization, hashed password storage, login success/failure, disabled-account rejection, user-scoped login history | TC-AUTH-001–004 |
| Budgets | Valid expense recording, budget update and invalid amount rejection | TC-BUDGET-001 |
| Savings goals | Contribution reaches target, goal completion and missing-goal handling | TC-GOAL-001 |
| Group savings | Group creation, unique membership, contributions, report totals and unknown-group handling | TC-GROUP-001–004 |
| Bills | Scheduled creation, owner isolation, one-time payment transition and timestamp | TC-BILL-001–003 |
| Payments | Pending/completed/refunded and recurring/scheduled/cancelled transitions; invalid and missing operations | TC-PAY-001–004 |
| Reports | Date and user filtering, spending totals, income summaries, invalid report inputs, current export-buffer contract | TC-REPORT-001–004 |
| Notifications | Alert creation, unread default and user-scoped retrieval | TC-NOTIFY-001 |
| Investment preferences | Allowed strategy persistence and rejection of unknown options | TC-INVEST-001 |

These tests cover service behaviors represented in the current TypeScript implementation. Provider integrations, external email delivery, live payment processing, and persistence across process restarts are not covered because they are not connected in this project.

## 2. Test cases

Fixtures use in-memory repositories and local HTTP requests. Expected and actual results below match the latest passing local run.

| ID | Requirement / scenario | Input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-ACCOUNT-001 | Look up account | Existing `A-204`; missing ID | Existing object returned; missing ID returns null | Matched | PASS |
| TC-ACCOUNT-002 | Account repository operations | Account `A-204`; user `U-7` | Create, update, save, and delete delegate to repositories in order | Matched | PASS |
| TC-AUTH-001 | Login history | Two events for `U-1`, one for `U-2` | Each user receives only their own events | Matched | PASS |
| TC-AUTH-002 | Register account | Spaced/cased values, strong password, valid phone; then invalid and duplicate inputs | Normalize valid values, hash password, create zero-balance account, reject invalid/duplicate input | Matched | PASS |
| TC-AUTH-003 | Login credentials | Correct then incorrect password | Correct credentials authenticate; wrong password fails; both attempts are recorded | Matched | PASS |
| TC-AUTH-004 | Disabled account | Correct credentials for disabled account | Login is rejected | Matched | PASS |
| TC-BUDGET-001 | Record expense | Food expense 300; then amount -1 | Valid expense updates budget and transaction; invalid expense makes no repository writes | Matched | PASS |
| TC-GOAL-001 | Goal contribution | Add 500 to goal with 500 remaining; then missing goal | Goal reaches target and completes; missing goal is unchanged | Matched | PASS |
| TC-GROUP-001 | Create savings group | Group `G-104` | Group is persisted and its ID returned | Matched | PASS |
| TC-GROUP-002 | Join savings group | Add `U-10` twice to `G-104` | Member is added once; duplicate does not persist | Matched | PASS |
| TC-GROUP-003 | Group contribution | Add 500 to `G-104`; contribute to missing group | Known group total increases; missing group has no effect | Matched | PASS |
| TC-GROUP-004 | Group report | Existing and missing group IDs | Existing totals and member count returned; missing group reports not found | Matched | PASS |
| TC-BILL-001 | Create bill | Bill `B-1` initially marked Paid | Service sets Scheduled and returns it only for its owner | Matched | PASS |
| TC-BILL-002 | Pay bill once | Scheduled bill `B-1` | Bill becomes Paid with a valid timestamp; repeated payment is rejected | Matched | PASS |
| TC-BILL-003 | Bill ownership and existence | Missing bill and bill owned by `U-1` requested by `U-2` | Both payment requests are rejected; stored bill remains Scheduled | Matched | PASS |
| TC-PAY-001 | Payment and refund lifecycle | Pending payment `p-1` | Process once to Completed; refund once to Refunded; repeats rejected | Matched | PASS |
| TC-PAY-002 | Recurring-payment lifecycle | Pending payment `p-2`, monthly schedule | Schedule then cancel; invalid repeats rejected | Matched | PASS |
| TC-PAY-003 | Missing payment | Cancel and refund unknown ID | No state changes or saves; not-found result returned | Matched | PASS |
| TC-PAY-004 | Invalid state transitions | Each operation against all modeled payment states | Invalid operation rejected and state is preserved | Matched | PASS |
| TC-REPORT-001 | Date-filtered activity report | November range, two users, one out-of-range transaction | Only matching user and date-range totals included | Matched | PASS |
| TC-REPORT-002 | Category and income totals | Income, Food and Rent transactions | Spending grouped by category; income statement and monthly summary totals match | Matched | PASS |
| TC-REPORT-003 | Report input validation | Unsupported type, missing user, invalid and reversed dates | Each invalid request returns null | Matched | PASS |
| TC-REPORT-004 | Report export adapter | Generated monthly report | Current service returns a Buffer containing report text | Matched | PASS |
| TC-NOTIFY-001 | Send alert | Alert for `U-12` | Alert is persisted as unread and appears in that user’s history | Matched | PASS |
| TC-INVEST-001 | Investment strategy | Known options, then unknown option | Valid strategy can be saved/read; unknown option returns HTTP 400 without saving | Matched | PASS |

## 3. Testing code

Tests are TypeScript files in [`backend-server/test`](../backend-server/test). Test case IDs appear in each test name. The project uses Node.js’s built-in `node:test` runner through `tsx`, with `c8` for coverage. No JUnit or Java test framework is used.

Run the complete backend suite from `backend-server`:

```text
npm test
```

The command builds the backend, runs all `*.test.ts` files, and writes text and LCOV coverage reports under `backend-server/coverage`.

## 4. Testing results

### Local run

Latest local run: **25 passed, 0 failed**. TypeScript backend build completed successfully.

| Coverage scope | Statements / lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| All instrumented backend files | 52.59% | 86.98% | 63.96% |
| `services.ts` | 80.13% | 92.91% | 81.57% |
| `controller.ts` | 27.23% | 82.35% | 20.00% |

Coverage includes the controller file because account and authentication scenarios exercise it. Several controller routes remain outside these unit scenarios; the overall percentage should not be read as complete application or end-to-end coverage.

`TC-REPORT-004` verifies only the current `exportToPDF` adapter contract: the implementation returns report text in a `Buffer`. It does not establish that the output is a standards-compliant PDF. The feature hub and other providers are tested only for their currently implemented local behavior, not live external integrations.

### GitHub Actions

The hosted `validate` job passed for commit `f651433`: backend tests and coverage generation, frontend production build, and container image builds all succeeded. The backend coverage artifact is attached to [GitHub Actions run #26](https://github.com/Ammar-M-Eid/Sigma-Pay/actions/runs/45972127399).

The separate SonarQube quality-gate job failed after the scan because its quality-gate API request returned HTTP 403. This does not change the successful test/build validation result; the SonarQube gate remains unsuccessful for that run.
