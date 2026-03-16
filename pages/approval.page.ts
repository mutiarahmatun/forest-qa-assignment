import { Page, expect } from "@playwright/test";

export class ApprovalPage {
  private static readonly locators = {
    workTreeShowIds: "#workTreeShowIds",
    approval: "#qtip-10-content #workflowEnableId",
    itemTextTitle: ".item-text-title",
    approveBtnText: ".approvebtn-text",
    approveBtnHasText: "Approve",
    commentBoxPlaceholder: "Enter comments ( optional )",
    approveButton: ".actionPost .postbtn-text",
    approveButtonHasText: "Approve",
    approvedSuccessText: /Approved successfully/i,
    approvedDialog: "div:has-text('Approved Successfully')",
    closeBtn: ".el-drawer__close-btn",
    header: ".viewheader-title",
    headerApprovedText: "Approved",
    headerA23Text: "A23",
  };

  constructor(private page: Page) {}

  async openMyTask() {
    await this.page.click(ApprovalPage.locators.workTreeShowIds);

    const approval = this.page.locator(ApprovalPage.locators.approval);
    await approval.waitFor({ state: "visible" });
    await approval.click();
    await this.page.waitForLoadState("networkidle");
  }

  async openSubmissionByTitle(title: string) {
    const submission = this.page
      .locator(ApprovalPage.locators.itemTextTitle, {
        hasText: new RegExp(`^${title}$`),
      })
      .first();

    await submission.waitFor({ state: "visible" });
    await submission.scrollIntoViewIfNeeded();
    await submission.click();
  }

  async approve() {
    const approveBtn = this.page.locator(ApprovalPage.locators.approveBtnText, {
      hasText: ApprovalPage.locators.approveBtnHasText,
    });

    await approveBtn.waitFor({ state: "visible" });
    await approveBtn.click();

    const commentBox = this.page.getByPlaceholder(
      ApprovalPage.locators.commentBoxPlaceholder,
    );

    await commentBox.waitFor({ state: "visible" });
    await commentBox.fill("Approve submission for automation");

    const approveButton = this.page.locator(
      ApprovalPage.locators.approveButton,
      {
        hasText: ApprovalPage.locators.approveButtonHasText,
      },
    );

    await approveButton.waitFor({ state: "visible" });
    await approveButton.click();
  }

  async verifyApproved() {
    await expect(
      this.page.getByText(ApprovalPage.locators.approvedSuccessText),
    ).toBeVisible();
  }

  async closeApprovalDialog() {
    const dialog = this.page.locator(ApprovalPage.locators.approvedDialog);
    const closeBtn = dialog.locator(ApprovalPage.locators.closeBtn);
    await closeBtn.waitFor({ state: "visible" });
    await closeBtn.click();
  }

  async verifySubmissionHeaderApproved() {
    const header = this.page.locator(ApprovalPage.locators.header);
    await header.waitFor({ state: "visible" });
    await expect(header).toContainText(ApprovalPage.locators.headerA23Text);
    await expect(header).toContainText(
      ApprovalPage.locators.headerApprovedText,
    );
  }
}
