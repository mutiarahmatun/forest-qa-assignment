# KRIS E-Submission Automation Testing

This repository contains automated test scripts for the **KRIS
E-Submission workflow** using **Playwright with Cucumber (BDD)**.

The automation focuses on validating the **submission approval
workflow**, including submission creation, termination, and approval.

---

# Tools & Framework

The following tools were used to implement this automation suite:

- **Playwright** -- browser automation
- **Cucumber (BDD)** -- behavior-driven testing
- **TypeScript** -- scripting language
- **Page Object Model (POM)** -- maintainable test architecture

This combination was chosen to ensure **readable tests, maintainable
code, and stable UI automation**.

---

# Test Scenarios Covered

## Scenario 1 -- Create and Terminate Submission

Create a new **For Approval** submission and terminate it.

Validations: - Submission created successfully - Submission header
contains **A23 submission ID** - Submission status = **Pending
Approval** - Termination success message is displayed

---

## Scenario 2 -- Verify Terminated Submission in Completed Tab

Validations: - Termination success message appears - Submission status =
**Terminated** - Submission appears in **Participated \> Completed** tab

---

## Scenario 3 -- Approve Submission

Validations: - System displays **Approved successfully** - Submission
header contains **A23 submission ID** - Submission status =
**Approved** - Submission appears in **Participated \> Completed** with
status **Approved**

---

# Project Structure

    forest-qa-automation
    │
    ├── fixtures
    │   └── browser.fixture.ts
    │
    ├── pages
    │   ├── login.page.ts
    │   ├── submission.page.ts
    │   ├── approval.page.ts
    │   └── completed.page.ts
    │
    ├── tests
    │   ├── features
    │   │   └── submission.feature
    │   │
    │   └── steps
    │       └── submission.steps.ts
    │
    ├── utils
    │   ├── test-context.ts
    │   └── test-data.ts
    │
    ├── tests/files
    │   ├── random_sample.pdf
    │   └── images.png
    │
    └── README.md

---

# Test Architecture

This automation suite follows the **Page Object Model (POM)** design
pattern.

### Pages

Each page class contains UI interaction logic for a specific module.

Examples: - `login.page.ts` → login actions - `submission.page.ts` →
submission creation & termination - `approval.page.ts` → approval
workflow - `completed.page.ts` → verification in completed tab

---

### Step Definitions

BDD step definitions connect the feature scenarios with page object
actions.

Flow example:

Feature Step → Step Definition → Page Object → Playwright Actions

This separation improves **maintainability and readability**.

---

# Test Data

Dynamic test data is used to ensure tests are **re-runnable**.

Example generated title:

    Automation Submission 171992345

This prevents duplicate submission failures when tests run multiple
times.

---

# Setup Instructions

### 1. Install dependencies

    npm install

### 2. Install Playwright browsers

    npx playwright install

---

# Running the Tests

Run the automation suite using:

    npm run test

This will launch the browser and execute all BDD scenarios.

---

# Test Reports

The automation captures useful debugging artifacts such as:

- screenshots on failure
- videos of the scenario

These help analyze failed test cases.

---

# Assumptions

The following assumptions were made during implementation:

- The KRIS demo environment remains stable during execution
- Test accounts have permission to create and approve submissions
- At least one folder exists in the **Recent tab** when adding a
  folder
- Submission workflow behaves consistently between executions

---

## Author

This automation test suite was implemented by:

**Mutia Rahmatun Husna**  
QA Automation Engineer
