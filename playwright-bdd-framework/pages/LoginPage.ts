// The Page Object Model keeps page selectors and UI interactions in one place.
import type { Page } from 'playwright';

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly inventoryContainer;
  private readonly loginError;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.loginError = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('/');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.inventoryContainer.waitFor({ state: 'visible' });
  }

  async verifyLoginErrorDisplayed(): Promise<void> {
    const errorMessage = await this.loginError.textContent();
    if (!errorMessage?.trim()) {
      throw new Error('Expected a login error message to be displayed.');
    }
  }
}