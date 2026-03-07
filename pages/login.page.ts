import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(
      "https://krisdemo.sqlview.com.sg/KRIS/login.do?method=reloadLogin",
    );
  }

  async login(username: string, password: string) {
    await this.page.locator("#userId").fill(username);
    await this.page.locator("#password").fill(password);

    await this.page.locator("#submitButton").click();

    await this.page.waitForLoadState("networkidle");
  }
}
