import reporter from "multiple-cucumber-html-reporter";

reporter.generate({
  jsonDir: "reports",

  reportPath: "reports/html",

  metadata: {
    browser: {
      name: "chromium",
      version: "playwright",
    },
    device: "Local test machine",
    platform: {
      name: "windows",
    },
  },

  customData: {
    title: "Forest QA Automation Report",
    data: [
      { label: "Project", value: "KRIS E-Submission Automation" },
      { label: "Tester", value: "QA Automation Engineer" },
      { label: "Framework", value: "Playwright + Cucumber" },
    ],
  },
});
