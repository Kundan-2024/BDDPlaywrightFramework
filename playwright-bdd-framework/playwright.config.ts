// Runtime defaults for the Playwright library; scenarios are still run by Cucumber.
//export const playwrightDefaults = {
  //baseURL: 'https://www.saucedemo.com',
  //browserName: 'chromium' as const,
  //headless: true,
//};

//new code
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/*.ts',
});

export default defineConfig({
  testDir,

  reporter: 'html',

  use: {
    headless: false,
    screenshot: 'on',
    trace: 'on',
  },
});