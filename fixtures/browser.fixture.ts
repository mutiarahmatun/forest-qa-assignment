import { chromium, Browser, BrowserContext, Page } from "playwright";

let browser: Browser;
let context: BrowserContext;
let page: Page;

export async function launchBrowser(): Promise<Page> {
  browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  context = await browser.newContext({
    recordVideo: {
      dir: "reports/videos/",
      size: { width: 1280, height: 720 },
    },
  });

  page = await context.newPage();

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
