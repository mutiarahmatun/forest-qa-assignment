import { Page, expect } from "@playwright/test";
import { generateSubmissionTitle } from "../utils/test-data";
import path from "path";

export class SubmissionPage {
  // Centralized static text and file paths
  private static readonly TEXT = {
    forApproval: "For Approval",
    add: "Add",
    update: "Update",
    addStep: "Add Step",
    submit: "Submit",
    terminate: "Terminate",
    updateFolder: "Update Folder",
    addRoutingStepDialog: "Add Routing Step",
    submitDialog: "Submit This Submission",
    closeDrawer: "close drawer",
    terminatedSuccessfully: "Terminated Successfully.",
    terminatedSuccessRegex: /Terminated successfully/i,
    headerInformationItem: ".headerInformation-item",
    lblDocName: "#lblDocName",
    informationValue: ".Information-value",
    viewHeaderTitle: ".viewheader-title",
    reasonPlaceholder: "Enter comments ( required )",
    pendingApproval: "Pending Approval",
    accountManager: "Account Manager",
  };

  private static readonly FILES = {
    mainPDF: "tests/files/random_sample.pdf",
    attachment: "tests/files/images.png",
  };
  // Centralized locators as static readonly properties
  private static readonly locators = {
    workTreeShowIds: "#workTreeShowIds",
    eSubmission: "#qtip-10-content #workflowEnableId",
    newSubmissionBtn: {
      role: "button" as const,
      name: "New Submission" as const,
    },
    forApprovalText: { text: SubmissionPage.TEXT.forApproval, exact: true },
    titleField: "#wfRequest\\.title",
    uploadPDF: "#uploadPDF",
    uploadAttachment: "#uploadedAttachment",
    addBtnText: { text: SubmissionPage.TEXT.add, exact: true },
    updateFolderText: SubmissionPage.TEXT.updateFolder,
    fileRefCheckbox: 'input[name="fileRef"]',
    updateBtnText: { text: SubmissionPage.TEXT.update, exact: true },
    addStepText: { text: SubmissionPage.TEXT.addStep, exact: true },
    approvalTypeDropdown: "#approvalTypeId",
    addActionUserId: "#addActionUserId",
    userSearchInput: "#userSearchInput input",
    checkBoxInput: "input.checkBoxInput",
    browseUserAddBtn: "#browseUserAddBtn",
    selectMoreUserDesignationDialog: "#selectMoreUserDesignationDialog",
    liSelectDesignationItem: ".liSelectDesignationItem",
    designationSelect: "select",
    actionAddBtn: ".actionAddBtn",
    addRoutingStepDialog: {
      role: "dialog" as const,
      name: SubmissionPage.TEXT.addRoutingStepDialog,
    },
    addBtn: "#addBtn",
    submitBtn: "#newsubBottomId",
    submitBtnText: { text: SubmissionPage.TEXT.submit, exact: true },
    submitDialog: {
      role: "dialog" as const,
      name: SubmissionPage.TEXT.submitDialog,
    },
    bottomTerminateBtn: "#bottomId .rejectbtn-text",
    terminateBtnText: SubmissionPage.TEXT.terminate,
    reasonInput: { placeholder: SubmissionPage.TEXT.reasonPlaceholder },
    terminateDialogBtn: ".actionPost .postbtn-text",
    terminateDialogBtnText: SubmissionPage.TEXT.terminate,
    headerInformationItem: SubmissionPage.TEXT.headerInformationItem,
    lblDocName: SubmissionPage.TEXT.lblDocName,
    informationValue: SubmissionPage.TEXT.informationValue,
    viewHeaderTitle: SubmissionPage.TEXT.viewHeaderTitle,
    terminatedSuccessText: SubmissionPage.TEXT.terminatedSuccessRegex,
    succMessageDrawer: ".succmessage",
    closeDrawerBtn: {
      role: "button" as const,
      name: SubmissionPage.TEXT.closeDrawer,
    },
    terminatedSuccessfullyText: SubmissionPage.TEXT.terminatedSuccessfully,
  };

  submissionTitle: string;

  constructor(private page: Page) {
    this.submissionTitle = generateSubmissionTitle();
  }
  async openModule() {
    await this.page.click(SubmissionPage.locators.workTreeShowIds);
    const eSubmission = this.page.locator(SubmissionPage.locators.eSubmission);
    await eSubmission.waitFor({ state: "visible" });
    await eSubmission.click();
  }

  async newSubmission() {
    await this.page
      .getByRole(SubmissionPage.locators.newSubmissionBtn.role, {
        name: SubmissionPage.locators.newSubmissionBtn.name,
      })
      .click();
    await this.page
      .getByText(SubmissionPage.locators.forApprovalText.text, {
        exact: SubmissionPage.locators.forApprovalText.exact,
      })
      .click();
  }

  async fillForm() {
    const titleField = this.page.locator(SubmissionPage.locators.titleField);
    await titleField.waitFor({ state: "visible" });
    await titleField.fill(this.submissionTitle);
  }

  async uploadMainPDF() {
    const filePath = path.resolve(SubmissionPage.FILES.mainPDF);
    await this.page.setInputFiles(SubmissionPage.locators.uploadPDF, filePath);
  }

  async uploadAttachment() {
    const filePath = path.resolve(SubmissionPage.FILES.attachment);
    await this.page.setInputFiles(
      SubmissionPage.locators.uploadAttachment,
      filePath,
    );
  }

  async selectRecentFolder() {
    await this.page
      .getByText(SubmissionPage.locators.addBtnText.text, {
        exact: SubmissionPage.locators.addBtnText.exact,
      })
      .click();
    await this.page
      .getByText(SubmissionPage.locators.updateFolderText)
      .waitFor();
    const checkbox = this.page
      .locator(SubmissionPage.locators.fileRefCheckbox)
      .first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await this.page
      .getByText(SubmissionPage.locators.updateBtnText.text, {
        exact: SubmissionPage.locators.updateBtnText.exact,
      })
      .click();
    await this.page
      .getByText(SubmissionPage.locators.updateFolderText)
      .waitFor({ state: "hidden" });
  }

  async addActionOfficer(username: string) {
    await this.page
      .getByText(SubmissionPage.locators.addStepText.text, {
        exact: SubmissionPage.locators.addStepText.exact,
      })
      .click();
    const dropdown = this.page.locator(
      SubmissionPage.locators.approvalTypeDropdown,
    );
    await dropdown.click();
    await this.page
      .getByText(SubmissionPage.locators.forApprovalText.text, {
        exact: SubmissionPage.locators.forApprovalText.exact,
      })
      .click();
    await this.page.locator(SubmissionPage.locators.addActionUserId).click();
    const searchInput = this.page.locator(
      SubmissionPage.locators.userSearchInput,
    );
    await searchInput.fill(username);
    await this.page.getByText(new RegExp(username, "i")).waitFor();
    await this.page.locator(SubmissionPage.locators.checkBoxInput).check();
    await this.page.locator(SubmissionPage.locators.browseUserAddBtn).click();
    const dialog = this.page.locator(
      SubmissionPage.locators.selectMoreUserDesignationDialog,
    );
    await dialog.waitFor({ state: "visible" });
    await dialog
      .locator(SubmissionPage.locators.liSelectDesignationItem)
      .filter({ hasText: new RegExp(username, "i") })
      .locator(SubmissionPage.locators.designationSelect)
      .selectOption({ label: SubmissionPage.TEXT.accountManager });
    await dialog.locator(SubmissionPage.locators.actionAddBtn).click();
    await this.page
      .getByRole(SubmissionPage.locators.addRoutingStepDialog.role, {
        name: SubmissionPage.locators.addRoutingStepDialog.name,
      })
      .locator(SubmissionPage.locators.addBtn)
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
      .locator(SubmissionPage.locators.submitBtn)
      .getByText(SubmissionPage.locators.submitBtnText.text, {
        exact: SubmissionPage.locators.submitBtnText.exact,
      });
    await submitBtn.waitFor({ state: "visible" });
    await submitBtn.click();
    const dialog = this.page.getByRole(
      SubmissionPage.locators.submitDialog.role,
      { name: SubmissionPage.locators.submitDialog.name },
    );
    await dialog.waitFor({ state: "visible" });
    await dialog
      .getByText(SubmissionPage.locators.submitBtnText.text, {
        exact: SubmissionPage.locators.submitBtnText.exact,
      })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async verifySuccess(message: string) {
    await expect(this.page.getByText(new RegExp(message, "i"))).toBeVisible();
  }

  async terminate() {
    const terminateBtn = this.page
      .locator(SubmissionPage.locators.bottomTerminateBtn)
      .filter({ hasText: SubmissionPage.locators.terminateBtnText })
      .last();
    await terminateBtn.waitFor({ state: "attached" });
    await terminateBtn.scrollIntoViewIfNeeded();
    await terminateBtn.click();
    const reasonInput = this.page.getByPlaceholder(
      SubmissionPage.locators.reasonInput.placeholder,
    );
    await reasonInput.fill("Terminate submission for testing automation");
    const terminateBtnDialog = this.page
      .locator(SubmissionPage.locators.terminateDialogBtn)
      .filter({ hasText: SubmissionPage.locators.terminateDialogBtnText });
    await terminateBtnDialog.waitFor({ state: "visible" });
    await terminateBtnDialog.scrollIntoViewIfNeeded();
    await terminateBtnDialog.click();
    await this.page.waitForLoadState("networkidle");
  }

  async verifySubmissionTitle() {
    const title = this.page
      .locator(SubmissionPage.locators.headerInformationItem)
      .filter({ has: this.page.locator(SubmissionPage.locators.lblDocName) })
      .locator(SubmissionPage.locators.informationValue)
      .first();
    await expect(title).toContainText(this.submissionTitle);
  }

  async verifyPendingApproval() {
    await expect(
      this.page.locator(SubmissionPage.locators.viewHeaderTitle),
    ).toContainText(
      new RegExp(`A23.*${SubmissionPage.TEXT.pendingApproval}`, "i"),
    );
  }

  async verifyTerminatedStatus(status: string) {
    await expect(
      this.page.getByText(SubmissionPage.locators.terminatedSuccessText),
    ).toBeVisible();
  }

  async closeDrawerIfPresent() {
    const drawer = this.page.locator(SubmissionPage.locators.succMessageDrawer);
    try {
      await drawer.waitFor({ state: "visible", timeout: 3000 });
      const closeBtn = this.page.getByRole(
        SubmissionPage.locators.closeDrawerBtn.role,
        { name: SubmissionPage.locators.closeDrawerBtn.name },
      );
      await closeBtn.click();
      await this.page
        .getByText(SubmissionPage.locators.terminatedSuccessfullyText)
        .waitFor({ state: "hidden" });
    } catch {
      console.log("Drawer not present, continue test...");
    }
  }
}
