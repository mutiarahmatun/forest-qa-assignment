import { Page, expect } from "@playwright/test";

export class ApprovalPage {
  constructor(private page: Page) {}

  async openMyTask() {
    await this.page.click("#workTreeShowIds");

    const approval = this.page.locator("#qtip-10-content #workflowEnableId");

    await approval.waitFor({ state: "visible" });

    await approval.click();

    await this.page.waitForLoadState("networkidle");
  }

  async openSubmissionByTitle(title: string) {
    const submission = this.page
      .locator(".item-text-title", {
        hasText: new RegExp(`^${title}$`),
      })
      .first();

    await submission.waitFor({ state: "visible" });
    await submission.scrollIntoViewIfNeeded();
    await submission.click();
  }

  async approve() {
    const approveBtn = this.page.locator(".approvebtn-text", {
      hasText: "Approve",
    });

    await approveBtn.waitFor({ state: "visible" });
    await approveBtn.click();

    const commentBox = this.page.getByPlaceholder(
      "Enter comments ( optional )",
    );

    await commentBox.waitFor({ state: "visible" });
    await commentBox.fill("Approve submission for automation");

    const approveButton = this.page.locator(".actionPost .postbtn-text", {
      hasText: "Approve",
    });

    await approveButton.waitFor({ state: "visible" });
    await approveButton.click();
  }

  async verifyApproved() {
    await expect(this.page.getByText(/Approved successfully/i)).toBeVisible();
  }

  async closeApprovalDialog() {
    const dialog = this.page.locator("div:has-text('Approved Successfully')");

    const closeBtn = dialog.locator(".el-drawer__close-btn");

    await closeBtn.waitFor({ state: "visible" });

    await closeBtn.click();
  }

  async verifySubmissionHeaderApproved() {
    const header = this.page.locator(".viewheader-title");

    await header.waitFor({ state: "visible" });

    await expect(header).toContainText("A23");

    await expect(header).toContainText("Approved");
  }
}
