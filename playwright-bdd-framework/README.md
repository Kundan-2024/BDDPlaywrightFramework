# Playwright BDD Framework

An end-to-end browser automation example for SauceDemo using Playwright as the browser library and Cucumber as the BDD runner.

## A. Project Architecture

```text
playwright-bdd-framework/
├── features/login.feature          # Gherkin behavior scenarios and tags
├── step-definitions/login.steps.ts # Connects Gherkin steps to page methods
├── pages/LoginPage.ts              # Login selectors and browser interactions
├── hooks/hooks.ts                  # Scenario browser lifecycle and failure capture
├── config/config.ts                # Loads and validates environment settings
├── config/.env.qa                   # QA URL and test-only credentials
├── config/.env.uat                  # UAT URL and test-only credentials
├── test-runner/runner.ts            # Starts Cucumber and forwards CLI arguments
├── utils/                           # Place for reusable test helpers
├── reports/                         # Generated Cucumber HTML report
├── screenshots/                     # Screenshots from failed scenarios
├── cucumber.js                      # Cucumber CLI and formatter configuration
├── playwright.config.ts             # Playwright browser/runtime defaults
├── tsconfig.json                    # TypeScript compiler settings
├── package.json                     # Dependencies and npm scripts
└── README.md                        # Framework setup and usage
```

## B. Installation

Use Node.js 18 or newer, then run these commands from this project directory:

```bash
npm install
```

## C. Install Playwright Browsers

Install Chromium, the default browser:

```bash
npx playwright install chromium
```

On Linux CI machines, install browser system dependencies as well:

```bash
npx playwright install --with-deps chromium
```

To run a different browser, install it too, then set `BROWSER=firefox` or `BROWSER=webkit`.

## D. Configure Environments

Edit `config/.env.qa` or `config/.env.uat`. `TEST_ENV` selects which file is loaded and defaults to `qa`. Values supplied in the process environment take precedence over values in the file.

```dotenv
BASE_URL=https://www.saucedemo.com
APP_USERNAME=standard_user
APP_PASSWORD=secret_sauce
APP_INVALID_USERNAME=invalid_user
APP_INVALID_PASSWORD=wrong_password
```

The SauceDemo credentials are test credentials supplied for this example. Keep real credentials out of source control. Optional runtime settings are `BROWSER` (`chromium`, `firefox`, or `webkit`), `HEADLESS` (`true` or `false`), and `TIMEOUT` (milliseconds).

## E. Execute All BDD Tests

```bash
npm run test:bdd
```

Select the environment with `TEST_ENV=uat`. In PowerShell:

```powershell
$env:TEST_ENV = "uat"; npm run test:bdd
```

## F. Execute a Specific Feature

```bash
npm run test:bdd -- features/login.feature
```

## G. Execute a Scenario or Tag

Run the smoke-tagged scenario:

```bash
npx cucumber-js --tags "@smoke"
```

The runner also forwards Cucumber options:

```bash
npm run test:bdd -- --tags "@regression"
npm run test:bdd -- --name "Successful login with valid credentials"
```

## H. Run in Headed Mode

```bash
npm run test:bdd:headed
```

## I. Generate the HTML Report

Each run generates `reports/cucumber-report.html`, including feature and scenario names, step results and durations, failure details, and attached failure screenshots.

```bash
npm run test:bdd:html
```

## J. Failure Screenshots

After a failed scenario, the `After` hook saves a full-page PNG under `screenshots/` and attaches the same image to the Cucumber result. The HTML report embeds the attachment. Page, context, and browser are closed in the hook's `finally` block, including when screenshot capture fails.

## K. End-to-End Execution

1. Cucumber reads a scenario from the feature file and matches each Gherkin step to a step definition.
2. Step definitions call the reusable login page object.
3. The page object uses Playwright's `Page` API to interact with SauceDemo in an isolated browser context.
4. Cucumber records each step's status and duration. Hooks capture failed scenarios, then close browser resources.
5. The configured Cucumber HTML formatter writes the final report.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

Playwright Test is not used to execute these scenarios; Cucumber owns test discovery, tags, lifecycle, and reporting.