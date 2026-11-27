# SigmaPay Test Report

This report records the TypeScript service tests, case identifiers, local results, coverage, and GitHub Actions evidence. The supplied CSE454 test-report document defines the reporting format. Functional requirements were cross-checked against `A:\CS Study\7th Sem\Advanced\old project docs\Requirments_V1[1].docx` (project SRS) and the SigmaPay final project proposal. This report maps only behaviors supported by these tests; it does not claim complete coverage of every proposal requirement.

## 1. Requirements under test

Acceptance criteria are tied to the final proposal's proposed service owners. Owners are marked proposed because team confirmation is not evidenced in the repository.

| Service | SRS FR | What must be true to pass | Test cases | Proposed owner |
| --- | --- | --- | --- | --- |
| Account and authentication | FR 1.1, 1.7 | Valid registration normalizes and stores a safe account; invalid/duplicate inputs and invalid credentials are rejected; login activity is user-scoped. | TC-ACCOUNT-001-002, TC-AUTH-001-004 | Ammar Mahmoud Eid Ahmed |
| Budgets and expenses | FR 2.1-2.3 | Valid expense updates the budget and transaction; invalid amounts cause no writes. | TC-BUDGET-001 | Mohammed Eslam Saad Abdelhakeem |
| Goals | FR 3.1 | Contributions update progress, complete at target, and missing goal IDs do not mutate data. | TC-GOAL-001 | Omar Ali Abdelhafiz Morsi |
| Group savings | FR 4.1-4.4 | Group creation with target, unique membership, per-member valid contribution balance and report totals behave correctly. | TC-GROUP-001-005 | Omar Ali Abdelhafiz Morsi |
| Bills and payments | FR 9.1-9.3 | Local bill/payment transitions, owner isolation, scheduling and invalid transition rejection work. | TC-BILL-001-003, TC-PAY-001-004 | Ammar Mahmoud Eid Ahmed |
| Reporting and analytics | FR 7.1-7.2 | User/date filters and totals are correct; PDF is valid, paginated and downloadable; invalid ranges are rejected. | TC-REPORT-001-007 | Mohammed Eslam Saad Abdelhakeem |
| Notifications | FR 3.2 (local alert storage only) | New alerts are saved unread and returned only to the owning user. | TC-NOTIFY-001 | Mohamed Ibrahim Mohamed Aly |
| Investment preferences | FR 5.2-5.3 (strategy preference only) | Allowed preferences persist; unsupported values are rejected without a write. | TC-INVEST-001 | Andrew Gamal Moris Shokr |

### Full proposal traceability

| Proposal FR | Coverage in this test suite | Status / limitation |
| --- | --- | --- |
| 1.1 account creation; 1.7 login activity | TC-AUTH-001-004 | Partial: local service paths only. Verification, password reset/change and 2FA (FR 1.2-1.6) are not covered. |
| 2.1 budgets; 2.2-2.3 expenses/categories | TC-BUDGET-001 | Partial: one valid/invalid expense scenario; budget creation, category rules, alerts and trends are not covered. |
| 2.4 budget alerts; 2.5 trends | None | Not covered. |
| 3.1 goal creation/tracking | TC-GOAL-001 | Partial: contribution completion and missing goal. Goal editing/deadlines/plans not covered. |
| 3.2 notifications; 3.3 AI optimization | TC-NOTIFY-001 | Partial: generic in-memory alert storage only; milestone triggers and AI recommendations not covered. |
| 4.1 group creation/join; 4.2 contributions; 4.3 analytics | TC-GROUP-001-004 | Partial: group creation, membership, contribution history and totals covered; group expenses and export/chart outputs are not covered. FR 4.5 reminders and 4.6 withdrawals are not covered. |
| 5.1 recommendations; 5.2 option selection; 5.3 strategy; 5.4 portfolio; 5.5 reports; 5.6 market alerts | TC-INVEST-001 | Partial: preference persistence only. No live market data, portfolio execution, investment reports or alerts. |
| 6.1 insights; 6.2 AI assistant; 6.3 human consultations | None | Not covered; no connected advisor provider. |
| 7.1 customizable reports; 7.2 export; 7.3 comparisons | TC-REPORT-001-007 | Partial: local filtering/totals and PDF export covered; interactive charts and period comparisons not covered. |
| 8.1 cards; 8.2 controls/monitoring | None | Not covered; no card provider. |
| 9.1 bills; 9.2 recurring payments; 9.3 transaction security | TC-BILL-001-003, TC-PAY-001-004 | Partial: in-memory lifecycle/ownership rules; no external processor, automatic execution or security audit. |
| 10.1-10.5 partner offers | None | Not covered. |
| 11.1-11.4 tutoring/resources | None | Not covered. |

The source specification also lists non-functional accuracy, performance and security requirements. This suite does not establish the 2-second/3-second/10,000-user targets, AES-256 at-rest/in-transit behavior, MFA, or 10-minute inactivity logout; these require dedicated integration/load/security tests. Test fixtures use in-memory repositories, so persistence across process restarts is outside this evidence.

## 2. Test cases

Fixtures use in-memory repositories and local HTTP requests. Expected and actual results below match the latest passing local run.

| ID | Requirement (SRS FR) | Description | Input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-ACCOUNT-001 | FR 1.1 | Look up account | Existing `A-204`; missing ID | Existing object returned; missing ID returns null | Matched | PASS |
| TC-ACCOUNT-002 | FR 1.1 | Account repository operations | Account `A-204`; user `U-7` | Create, update, save, and delete delegate to repositories in order | Matched | PASS |
| TC-AUTH-001 | FR 1.7 | Login history | Two events for `U-1`, one for `U-2` | Each user receives only their own events | Matched | PASS |
| TC-AUTH-002 | FR 1.1 | Register account | Spaced/cased values, strong password, valid phone; then invalid and duplicate inputs | Normalize valid values, hash password, create zero-balance account, reject invalid/duplicate input | Matched | PASS |
| TC-AUTH-003 | FR 1.1 | Login credentials | Correct then incorrect password | Correct credentials authenticate; wrong password fails; both attempts are recorded | Matched | PASS |
| TC-AUTH-004 | FR 1.1 | Disabled account | Correct credentials for disabled account | Login is rejected | Matched | PASS |
| TC-BUDGET-001 | FR 2.1-2.3 | Record expense | Food expense 300; then amount -1 | Valid expense updates budget and transaction; invalid expense makes no repository writes | Matched | PASS |
| TC-GOAL-001 | FR 3.1 | Goal contribution | Add 500 to goal with 500 remaining; then missing goal | Goal reaches target and completes; missing goal is unchanged | Matched | PASS |
| TC-GROUP-001 | FR 4.1 | Create savings group | Group `G-104` | Group is persisted and its ID returned | Matched | PASS |
| TC-GROUP-002 | FR 4.1 | Join savings group | Add `U-10` twice to `G-104` | Member is added once; duplicate does not persist | Matched | PASS |
| TC-GROUP-003 | FR 4.2 | Group contribution | Add 500 to `G-104`; contribute to missing group | Known group total increases; missing group has no effect | Matched | PASS |
| TC-GROUP-004 | FR 4.3 | Group report | Group with member contributions; missing ID | Target, aggregate/member contributions, and member count returned; missing group reports not found | Matched | PASS |
| TC-GROUP-005 | FR 4.1-4.2 | Shared target and contribution API | Create group with 12,000 target; member deposit 500; nonmember deposit 700 | Target is persisted; member contribution succeeds and appears in report; nonmember deposit is rejected | Matched | PASS |
| TC-BILL-001 | FR 9.1 | Create bill | Bill `B-1` initially marked Paid | Service sets Scheduled and returns it only for its owner | Matched | PASS |
| TC-BILL-002 | FR 9.1 | Pay bill once | Scheduled bill `B-1` | Bill becomes Paid with a valid timestamp; repeated payment is rejected | Matched | PASS |
| TC-BILL-003 | FR 9.1, 9.3 | Bill ownership and existence | Missing bill and bill owned by `U-1` requested by `U-2` | Both payment requests are rejected; stored bill remains Scheduled | Matched | PASS |
| TC-PAY-001 | FR 9.1, 9.3 | Payment and refund lifecycle | Pending payment `p-1` | Process once to Completed; refund once to Refunded; repeats rejected | Matched | PASS |
| TC-PAY-002 | FR 9.2 | Recurring-payment lifecycle | Pending payment `p-2`, monthly schedule | Schedule then cancel; invalid repeats rejected | Matched | PASS |
| TC-PAY-003 | FR 9.2, 9.3 | Missing payment | Cancel and refund unknown ID | No state changes or saves; not-found result returned | Matched | PASS |
| TC-PAY-004 | FR 9.3 | Invalid state transitions | Each operation against all modeled payment states | Invalid operation rejected and state is preserved | Matched | PASS |
| TC-REPORT-001 | FR 7.1 | Date-filtered activity report | November range, two users, one out-of-range transaction | Only matching user and date-range totals included | Matched | PASS |
| TC-REPORT-002 | FR 7.1 | Category and income totals | Income, Food and Rent transactions | Spending grouped by category; income statement and monthly summary totals match | Matched | PASS |
| TC-REPORT-003 | FR 7.1 | Report input validation | Unsupported type, missing user, invalid and reversed dates | Each invalid request returns null | Matched | PASS |
| TC-REPORT-004 | FR 7.2 | PDF export service | Generated monthly report | Returns PDF Buffer with PDF 1.4 header and EOF marker | Matched | PASS |
| TC-REPORT-005 | FR 7.2 | PDF structure and safe text output | Parentheses, backslash, newline and Unicode input | Valid xref/object offsets, escaped literal text, sanitized unsupported characters | Matched | PASS |
| TC-REPORT-006 | FR 7.2 | PDF pagination | 160 long transaction lines | Multiple pages and consistent page tree/page numbering | Matched | PASS |
| TC-REPORT-007 | FR 7.2 | PDF download endpoint | Spending report range and reversed range | PDF attachment headers/content; invalid range returns 400 | Matched | PASS |
| TC-NOTIFY-001 | FR 3.2 (local alerts) | Send alert | Alert for `U-12` | Alert is persisted as unread and appears in that userâ€™s history | Matched | PASS |
| TC-INVEST-001 | FR 5.2-5.3 | Investment strategy | Known options, then unknown option | Valid strategy can be saved/read; unknown option returns HTTP 400 without saving | Matched | PASS |

## 3. Testing code

Tests are TypeScript files in [`backend-server/test`](../backend-server/test). Test case IDs appear in each test name. The project uses Node.jsâ€™s built-in `node:test` runner through `tsx`, with `c8` for coverage. No JUnit or Java test framework is used.

Run the complete backend suite from `backend-server`:

```text
npm test
```

The command builds the backend, runs all `*.test.ts` files, and writes text and LCOV coverage reports under `backend-server/coverage`.

## 4. Testing results

### Local run

Latest local run after commit `bae073b`: **29 passed, 0 failed**. TypeScript compilation passed as part of `npm test`. Coverage: 64.75% statements/lines, 84.87% branches, 67.56% functions overall.

| Coverage scope | Statements / lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| All instrumented backend files | 64.75% | 84.87% | 67.56% |
| `services.ts` | 82.63% | 91.71% | 81.57% |
| `controller.ts` | 49.16% | 74.54% | 30.90% |

Coverage includes the controller file because account and authentication scenarios exercise it. Several controller routes remain outside these unit scenarios; the overall percentage should not be read as complete application or end-to-end coverage.

PDF checks verify the generated file header, object offsets and cross-reference table, escaping/sanitization, multi-page structure, and the HTTP attachment response. These checks do not cover rendering compatibility in every PDF viewer. Coverage percentages are measured across all instrumented backend files; a passing suite does not imply full SRS coverage.

### GitHub Actions

GitHub Actions run [#32](https://github.com/Ammar-M-Eid/Sigma-Pay/actions/runs/45976252658) for commit `bd7dbaa` shows the `validate` job passed, including backend build/tests/coverage, frontend build, and container image builds. The workflow run also produced the `backend-coverage` artifact. The SonarQube scan succeeded, but its separate quality-gate enforcement step failed (HTTP 403); therefore the overall workflow is marked failed even though project validation passed. See the run page for pipeline evidence and job annotations.
