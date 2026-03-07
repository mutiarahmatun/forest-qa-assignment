import { Page, expect } from "@playwright/test";
import { generateSubmissionTitle } from "../utils/test-data";
import path from "path";

export class SubmissionPage {
  submissionTitle: string;

  constructor(private page: Page) {
    this.submissionTitle = generateSubmissionTitle();
  }
  async openModule() {
    await this.page.click("#workTreeShowIds");

    const eSubmission = this.page.locator("#qtip-10-content #workflowEnableId");

    await eSubmission.waitFor({ state: "visible" });

    await eSubmission.click();
  }

  async newSubmission() {
    await this.page.getByRole("button", { name: "New Submission" }).click();

    await this.page.getByText("For Approval", { exact: true }).click();
  }

  async fillForm() {
    const titleField = this.page.locator("#wfRequest\\.title");

    await titleField.waitFor({ state: "visible" });

    await titleField.fill(this.submissionTitle);
  }

  async uploadMainPDF() {
    const filePath = path.resolve("tests/files/random_sample.pdf");

    await this.page.setInputFiles("#uploadPDF", filePath);
  }

  async uploadAttachment() {
    const filePath = path.resolve("tests/files/images.png");

    await this.page.setInputFiles("#uploadedAttachment", filePath);
  }

  async selectRecentFolder() {
    await this.page.getByText("Add", { exact: true }).click();

    await this.page.getByText("Update Folder").waitFor();

    const checkbox = this.page.locator('input[name="fileRef"]').first();

    await checkbox.click();

    await expect(checkbox).toBeChecked();

    await this.page.getByText("Update", { exact: true }).click();

    await this.page.getByText("Update Folder").waitFor({ state: "hidden" });
  }

  async addActionOfficer(username: string) {
    await this.page.getByText("Add Step", { exact: true }).click();

    const dropdown = this.page.locator("#approvalTypeId");

    await dropdown.click();
    await this.page.getByText("For Approval", { exact: true }).click();

    await this.page.locator("#addActionUserId").click();

    const searchInput = this.page.locator("#userSearchInput input");

    await searchInput.fill(username);

    await this.page.getByText(new RegExp(username, "i")).waitFor();

    await this.page.locator("input.checkBoxInput").check();

    await this.page.locator("#browseUserAddBtn").click();

    const dialog = this.page.locator("#selectMoreUserDesignationDialog");

    await dialog.waitFor({ state: "visible" });

    await dialog
      .locator(".liSelectDesignationItem")
      .filter({ hasText: new RegExp(username, "i") })
      .locator("select")
      .selectOption({ label: "Account Manager" });

    await dialog.locator(".actionAddBtn").click();

    await this.page
      .getByRole("dialog", { name: "Add Routing Step" })
      .locator("#addBtn")
      .click();
  }

  async createSubmission(username: string) {
    await this.newSubmission();

    await this.fillForm();

    await this.uploadMainPDF();

    await this.uploadAttachment();

    await this.selectRecentFolder();

    await this.addActionOfficer(username);
  }

  async submit() {
    const submitBtn = this.page
      .locator("#newsubBottomId")
      .getByText("Submit", { exact: true });

    await submitBtn.waitFor({ state: "visible" });
    await submitBtn.click();

    const dialog = this.page.getByRole("dialog", {
      name: "Submit This Submission",
    });

    await dialog.waitFor({ state: "visible" });

    await dialog.getByText("Submit", { exact: true }).click();

    await this.page.waitForLoadState("networkidle");
  }

  async verifySuccess(message: string) {
    await expect(this.page.getByText(new RegExp(message, "i"))).toBeVisible();
  }

  async terminate() {
    const terminateBtn = this.page
      .locator("#bottomId .rejectbtn-text")
      .filter({ hasText: "Terminate" })
      .last();
    await terminateBtn.waitFor({ state: "attached" });
    await terminateBtn.scrollIntoViewIfNeeded();
    await terminateBtn.click();

    const reasonInput = this.page.getByPlaceholder(
      "Enter comments ( required )",
    );

    await reasonInput.fill("Terminate submission for testing automation");

    const terminateBtnDialog = this.page
      .locator(".actionPost .postbtn-text")
      .filter({ hasText: "Terminate" });

    await terminateBtnDialog.waitFor({ state: "visible" });
    await terminateBtnDialog.scrollIntoViewIfNeeded();
    await terminateBtnDialog.click();
    await this.page.waitForLoadState("networkidle");
  }

  async verifySubmissionTitle() {
    const title = this.page
      .locator(".headerInformation-item")
      .filter({ has: this.page.locator("#lblDocName") })
      .locator(".Information-value")
      .first();

    await expect(title).toContainText(this.submissionTitle);
  }

  async verifyPendingApproval() {
    await expect(this.page.locator(".viewheader-title")).toContainText(
      /A23.*Pending Approval/i,
    );
  }

  async verifyTerminatedStatus(status: string) {
    await expect(this.page.getByText(/Terminated successfully/i)).toBeVisible();
  }

  async closeDrawerIfPresent() {
    const drawer = this.page.locator(".succmessage");

    try {
      await drawer.waitFor({ state: "visible", timeout: 3000 });

      const closeBtn = this.page.getByRole("button", { name: "close drawer" });

      await closeBtn.click();

      await this.page
        .getByText("Terminated Successfully.")
        .waitFor({ state: "hidden" });
    } catch {
      console.log("Drawer not present, continue test...");
    }
  }
}
