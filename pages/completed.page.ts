import { expect, Page } from "@playwright/test";

export class CompletedPage {
  private static readonly locators = {
    participatedTab: ".naviga-title",
    participatedTabHasText: "Participated",
    completedTabRole: "tab" as const,
    completedTabName: /Completed/,
    row: "li.item",
    title: ".search-submission-position",
    status: ".item-text-status",
    statusTerminated: "Terminated",
    statusApproved: "Approved",
  };

  constructor(private page: Page) {}

  async goToParticipatedCompleted() {
    const participatedTab = this.page.locator(
      CompletedPage.locators.participatedTab,
      {
        hasText: CompletedPage.locators.participatedTabHasText,
      },
    );
    await participatedTab.waitFor({ state: "visible" });
    console.log("Clicking on Participated tab");
    await participatedTab.click();
    console.log("Clicked on Participated tab, now clicking on Completed tab");

    const completedTab = this.page.getByRole(
      CompletedPage.locators.completedTabRole,
      {
        name: CompletedPage.locators.completedTabName,
      },
    );
    await completedTab.waitFor({ state: "visible" });
    console.log("Showing Completed tab");
    await completedTab.click();
    console.log("Clicked on Completed tab");
  }

  async verifySubmissionInCompleted(submissionTitle: string) {
    const row = this.page.locator(CompletedPage.locators.row, {
      hasText: submissionTitle,
    });
    const title = row.locator(CompletedPage.locators.title).first();
    const status = row.locator(CompletedPage.locators.status);
    await expect(title).toContainText(submissionTitle);
    await expect(status).toHaveText(CompletedPage.locators.statusTerminated);
  }

  async verifyApprovedSubmission(submissionTitle: string) {
    const row = this.page.locator(CompletedPage.locators.row, {
      hasText: submissionTitle,
    });
    const title = row.locator(CompletedPage.locators.title).first();
    const status = row.locator(CompletedPage.locators.status);
    await status.waitFor({ state: "visible" });
    await expect(title).toContainText(submissionTitle);
    await expect(status).toHaveText(CompletedPage.locators.statusApproved);
  }
}
