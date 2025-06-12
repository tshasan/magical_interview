import { Browser, chromium, Page } from "playwright";

export async function createSession(url: string): Promise<{ browser: Browser, page: Page }> { 
  console.log("Launching Chrome browser...");
  const browser = await chromium.launch({
    args: ["--window-size=1366,768"],
    headless: false
  });
  console.log("Browser launched successfully");
  
  console.log("Creating new page...");
  const activePage = await browser.newPage();
  if (!activePage) {
    console.error("Failed to create new page");
    await browser.close(); 
    throw new Error("No page found");
  }
  console.log("Page created successfully");

  console.log(`Navigating to ${url}...`);
  await activePage.goto(url);
  console.log("Navigation completed");

  return { browser, page: activePage }; 
}
