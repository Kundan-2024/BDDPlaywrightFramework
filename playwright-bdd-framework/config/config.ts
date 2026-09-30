// Load the selected environment file before exposing settings to hooks and steps.
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { playwrightDefaults } from '../playwright.config';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

const testEnvironment = process.env.TEST_ENV ?? 'qa';
if (testEnvironment !== 'qa' && testEnvironment !== 'uat') {
  throw new Error(`Unsupported TEST_ENV "${testEnvironment}". Choose "qa" or "uat".`);
}

dotenv.config({ path: resolve(__dirname, `.env.${testEnvironment}`) });

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Set it in config/.env.${testEnvironment} or the environment.`);
  }
  return value;
}

function booleanEnvironmentValue(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.toLowerCase();
  if (value === undefined) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`${name} must be "true" or "false".`);
}

const timeout = Number(process.env.TIMEOUT ?? 30_000);
if (!Number.isFinite(timeout) || timeout <= 0) {
  throw new Error('TIMEOUT must be a positive number of milliseconds.');
}

const browserName = process.env.BROWSER ?? playwrightDefaults.browserName;
if (!(browserName in { chromium: true, firefox: true, webkit: true })) {
  throw new Error('BROWSER must be "chromium", "firefox", or "webkit".');
}

export const config = {
  baseUrl: process.env.BASE_URL?.trim() || playwrightDefaults.baseURL,
  browserName: browserName as BrowserName,
  headless: booleanEnvironmentValue('HEADLESS', playwrightDefaults.headless),
  timeout,
  username: requiredEnvironmentValue('APP_USERNAME'),
  password: requiredEnvironmentValue('APP_PASSWORD'),
  invalidUsername: requiredEnvironmentValue('APP_INVALID_USERNAME'),
  invalidPassword: requiredEnvironmentValue('APP_INVALID_PASSWORD'),
};