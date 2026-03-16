import {
  Given,
  When,
  Then,
  setDefaultTimeout,
  After,
} from "@cucumber/cucumber";
import { Page } from "playwright";
import { launchBrowser, closeBrowser } from "../../fixtures/browser.fixture";
import { LoginPage } from "../../pages/login.page";
import { SubmissionPage } from "../../pages/submission.page";
import { ApprovalPage } from "../../pages/approval.page";
import { CompletedPage } from "../../pages/completed.page";
import { requester, approver } from "../../utils/test-data";
import { testContext } from "../../utils/test-contexts";
import fs from "fs";

let page: Page;

let loginPage: LoginPage;
let submissionPage: SubmissionPage;
let approvalPage: ApprovalPage;
let completedPage: CompletedPage;

setDefaultTimeout(60000);

Given("user is logged in as requester", async () => {
  page = await launchBrowser();

  loginPage = new LoginPage(page);
  submissionPage = new SubmissionPage(page);
  completedPage = new CompletedPage(page);

  await loginPage.goto();

  await loginPage.login(requester.username, requester.password);
});

Given("user login as approver", async () => {
  page = await launchBrowser();

  loginPage = new LoginPage(page);
  approvalPage = new ApprovalPage(page);
  completedPage = new CompletedPage(page);

  await loginPage.goto();

  await loginPage.login(approver.username, approver.password);
});

When("user opens the E-Submission module", async function () {
  await submissionPage.openModule();
});

When('user creates a new "For Approval" submission', async function () {
  await submissionPage.newSubmission();

  await submissionPage.fillForm();
  testContext.submissionTitle = submissionPage.submissionTitle;

  await submissionPage.uploadMainPDF();

  await submissionPage.uploadAttachment();

  await submissionPage.selectRecentFolder();

  await submissionPage.addActionOfficer(approver.username);
});

When("user submits the submission", async () => {
  await submissionPage.submit();
  await submissionPage.verifySuccess("Submitted successfully");
  await submissionPage.verifySubmissionTitle();
  await submissionPage.verifyPendingApproval();
});

When("requester closes the browser", async function () {
  await closeBrowser();
});

When("user terminates the submission sucessfully", async function () {
  await submissionPage.terminate();
  await submissionPage.verifyTerminatedStatus("Terminated");
  await submissionPage.closeDrawerIfPresent();
});

When('user go to the "Participated > Completed" tab', async function () {
  await completedPage.goToParticipatedCompleted();
});

Then(
  'the terminated submission should appear in the list with status "Terminated"',
  async function () {
    await completedPage.verifySubmissionInCompleted(
      testContext.submissionTitle,
    );
  },
);

When("approver approves a pending submission", async function () {
  await approvalPage.openMyTask();

  await approvalPage.openSubmissionByTitle(testContext.submissionTitle);
  await approvalPage.approve();
});

Then('submission status should be "Approved"', async () => {
  await approvalPage.verifyApproved();
  await approvalPage.closeApprovalDialog();
  await approvalPage.verifySubmissionHeaderApproved();
});

Then('submission should appear in "Completed"', async () => {
  await completedPage.goToParticipatedCompleted();
  await completedPage.verifyApprovedSubmission(testContext.submissionTitle);
});

After(async function (scenario) {
  if (scenario.result?.status === "FAILED") {
    const screenshot = await page?.screenshot();

    const dir = "reports/screenshots";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${dir}/${Date.now()}.png`;

    fs.writeFileSync(fileName, screenshot);

    await this.attach(screenshot, "image/png");
  }

  await closeBrowser();
});
