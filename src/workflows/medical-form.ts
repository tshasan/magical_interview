import {Page} from 'playwright';
import {generateHealthData, getActionPlanWithHtml} from '../agent/agent';
import {defaultFormData} from '../config';
import {FormData, HealthLevel} from '../types'; // Ensure Action and HealthLevel are imported

export async function runMedicalForm(
  page: Page,
  data: FormData,
  // These parameters will be supplied by the caller (e.g., the API server)
  generateSetting: boolean,
  healthLevelSetting: HealthLevel,
) {
  // Start with default form data and merge any specific data passed in
  let formDataToProcess = {...defaultFormData, ...data};

  // Use the generateSetting passed as a parameter
  if (generateSetting) {
    // Use the healthLevelSetting passed as a parameter
    console.log(
      `Workflow: Data generation is ON. Generating health data based on health level: ${healthLevelSetting}`,
    );
    formDataToProcess = await generateHealthData(
      formDataToProcess,
      healthLevelSetting,
    );
    console.log('Workflow: Generated form data:', formDataToProcess);
  } else {
    console.log(
      'Workflow: Data generation is OFF. Using provided/default form data without new generation.',
    );
  }

  console.log('Workflow: Capturing page HTML...');
  const html = await page.content();
  console.log('Workflow: HTML captured successfully');

  console.log(
    'Workflow: Generating action plan based on page HTML using data:',
    formDataToProcess,
  );
  const plan = await getActionPlanWithHtml(formDataToProcess, html);

  console.log(`Workflow: Executing ${plan.length} actions...`);
  for (const action of plan) {
    const valuePart =
      'value' in action && action.value !== undefined
        ? ` with value ${action.value}`
        : '';
    console.log(
      `Workflow: Executing action: ${action.type} on ${action.selector}${valuePart}`,
    );
    try {
      switch (action.type) {
        case 'fill':
          if (!('value' in action) || action.value === undefined) {
            console.warn(
              `Workflow: Skipping fill action for selector ${action.selector} due to undefined or missing value.`,
            );
            continue;
          }
          await page.fill(action.selector, action.value);
          break;
        case 'click':
          await page.click(action.selector);
          break;
        case 'select':
          if (!('value' in action) || action.value === undefined) {
            console.warn(
              `Workflow: Skipping select action for selector ${action.selector} due to undefined or missing value.`,
            );
            continue;
          }
          await page.selectOption(action.selector, action.value);
          break;
        default:
          console.warn(
            `Workflow: Unknown action type: ${(action as any).type}`,
          );
      }
      await page.waitForTimeout(500);
    } catch (error) {
      console.error(
        `Workflow: Error executing action ${action.type} on ${action.selector}:`,
        error,
      );
    }
  }
  console.log('Workflow: All actions executed.');
}
