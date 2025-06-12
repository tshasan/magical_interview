import { defaultFormData, generate as generateSetting, healthLevel as healthLevelSetting, URL } from "./config"; // Import generate and healthLevel
import { createSession } from "./session";
import { runMedicalForm } from "./workflows/medical-form";

export async function main() {
  const { browser, page } = await createSession(URL); // Destructure browser and page
  try {
    // Pass generateSetting and healthLevelSetting to runMedicalForm
    await runMedicalForm(page, defaultFormData, generateSetting, healthLevelSetting);
  } catch (error) {
    console.error("Error in main execution:", error);
  } finally {
    await browser.close(); // Ensure browser is closed
    console.log("Browser closed in main execution.");
  }
}
