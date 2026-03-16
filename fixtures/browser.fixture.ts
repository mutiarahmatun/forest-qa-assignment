import { chromium, Browser, BrowserContext, Page } from "playwright";

let browser: Browser;
let context: BrowserContext;
let page: Page;

export async function launchBrowser(): Promise<Page> {
  browser = await chromium.launch({
    headless: process.env.CI ? true : false,
    slowMo: process.env.CI ? 0 : 100,
  });

  context = await browser.newContext({
    recordVideo: {
      dir: "reports/videos/",
      size: { width: 1280, height: 720 },
    },
  });

  page = await context.newPage();

  page.on("console", (msg) => {
    console.log("Browser log:", msg.text());
  });

  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });

  return page;
}

export async function closeBrowser() {
  if (context) {
    await context.tracing.stop({
      path: `reports/traces/trace-${Date.now()}.zip`,
    });
  }

  if (browser) {
    await browser.close();
  }
}
