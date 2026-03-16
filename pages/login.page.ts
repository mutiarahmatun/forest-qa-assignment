import { Page } from "@playwright/test";

export class LoginPage {
  private static readonly locators = {
    userId: "#userId",
    password: "#password",
    submitButton: "#submitButton",
    loginUrl:
      "https://krisdemo.sqlview.com.sg/KRIS/login.do?method=reloadLogin",
  };

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(LoginPage.locators.loginUrl);
  }

  async login(username: string, password: string) {
    await this.page.locator(LoginPage.locators.userId).fill(username);
    await this.page.locator(LoginPage.locators.password).fill(password);
    await this.page.locator(LoginPage.locators.submitButton).click();
    await this.page.waitForLoadState("networkidle");
  }
}
