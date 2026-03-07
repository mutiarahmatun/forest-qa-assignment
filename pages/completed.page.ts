import { expect, Page } from "@playwright/test";

export class CompletedPage {
  constructor(private page: Page) {
    this.page = page;
  }

  async goToParticipatedCompleted() {
    const participatedTab = this.page.locator(".naviga-title", {
      hasText: "Participated",
    });

    await participatedTab.waitFor({ state: "visible" });
    await participatedTab.click();

    const completedTab = this.page.getByRole("tab", { name: /Completed/ });

    await completedTab.waitFor({ state: "visible" });
    await completedTab.click();
  }

  async verifySubmissionInCompleted(submissionTitle: string) {
    const row = this.page.locator("li.item", { hasText: submissionTitle });

    const title = row.locator(".search-submission-position").first();
    const status = row.locator(".item-text-status");

    await expect(title).toContainText(submissionTitle);
    await expect(status).toHaveText("Terminated");
  }

  async verifyApprovedSubmission(submissionTitle: string) {
    const row = this.page.locator("li.item", {
      hasText: submissionTitle,
    });
    const title = row.locator(".search-submission-position").first();
    const status = row.locator(".item-text-status");

    await status.waitFor({ state: "visible" });
    await expect(title).toContainText(submissionTitle);
    await expect(status).toHaveText("Approved");
  }
}
