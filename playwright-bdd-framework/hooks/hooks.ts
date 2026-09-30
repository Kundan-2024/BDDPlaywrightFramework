// Hooks create and dispose browser resources around each Cucumber scenario.
import {
  After,
  Before,
  ITestCaseHookParameter,
  setDefaultTimeout,
  setWorldConstructor,
  Status,
  World,
  IWorldOptions,
} from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium, firefox, webkit } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { config } from '../config/config';
import { LoginPage } from '../pages/LoginPage';

// A Playwright Page is a single tab; BrowserContext isolates scenario state.
export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(config.timeout);

const browserLaunchers = { chromium, firefox, webkit };

Before(async function (this: CustomWorld) {
  const browserLauncher = browserLaunchers[config.browserName];
  const browser = await browserLauncher.launch({ headless: config.headless });
  this.browser = browser;
  this.context = await browser.newContext({ baseURL: config.baseUrl });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.timeout);
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  try {
    if (scenario.result?.status === Status.FAILED && this.page) {
      const screenshotsDirectory = resolve(process.cwd(), 'screenshots');
      const scenarioName = scenario.pickle.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const screenshotPath = resolve(
        screenshotsDirectory,
        `${Date.now()}-${scenarioName || 'failed-scenario'}.png`,
      );

      await mkdir(screenshotsDirectory, { recursive: true });
      const screenshot = await this.page.screenshot({ fullPage: true });
      await writeFile(screenshotPath, screenshot);
      // Cucumber's HTML formatter embeds attached image data in the report.
      await this.attach(screenshot, 'image/png');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await this.attach(`Could not capture failure screenshot: ${message}`, 'text/plain');
  } finally {
    await this.page?.close().catch(() => undefined);
    await this.context?.close().catch(() => undefined);
    await this.browser?.close().catch(() => undefined);
  }
});