import { FormData, HealthLevel } from "../types";

export const systemPrompt = `
You are an AI assistant that specializes in web automation. 
Your task is to help fill out forms by analyzing HTML and providing precise actions.
Always return responses in the exact format requested, with no additional explanation.
`; // this is the system prompt for the llm

// This prompt below is probably the most important one, it defines the agent's behavior and how it should interact with the HTML and data provided. as it will parse html generate a action plan and find the selectors. The primary issue that arrives in this is identifying the selectors and then figureing out what order they will be interacted with. I considered using aria labels but i have no idea how well that will work.
export function createHtmlAnalysisPrompt(data: FormData, html: string): string {
  return `
You are WebFormAgent, an autonomous AI specialized in HTML form automation with Playwright.
Your mission is to analyze the provided HTML form and create a precise action plan using Playwright locators.

## HTML TO ANALYZE
\`\`\`html
${html}
\`\`\`

## DATA TO ENTER
${
  Object.entries(data)
    .filter(([_, v]) =>
      v !== undefined && v !== null && v !== '' && (Array.isArray(v) ? v.length : true)
    )
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n')
}

## SELECTOR-VERIFICATION STRATEGY
1. **SCAN** the entire HTML for every form element and its exact attributes.  
2. **VERIFY** each selector exists in the HTML before using it.  
3. **MAP** each data key to the real element (do not assume names == IDs).  
4. Handle naming mismatches (e.g. “currentMedications” → \`#medications\`).  
5. Prefer the most robust selector available (ID > name > text > CSS class).

## AUTONOMOUS ANALYSIS STRATEGY
As WebFormAgent, I will:

1. OBSERVE the HTML to identify all interactive elements by:
   - Scanning for form inputs, structural elements, and navigation components
   - Identifying field labels, placeholder text, and accessible names
   - Detecting form structure including tabs, accordions, and nested elements
   
2. REASON about the form completion workflow by:
   - Mapping each data point to its most appropriate form element
   - Planning the optimal sequence of actions
   - Identifying dependencies between fields and sections
   - Recognizing when sections need to be expanded before interaction

3. EXECUTE precise DOM actions using Playwright-compatible locators

## PLAYWRIGHT LOCATOR STRATEGIES
I will prioritize these Playwright locator techniques in order of preference:

1. ID-based: \`#elementId\` (confirm ID exists in HTML first)
2. Name-based: \`[name="fieldName"]\` (when ID doesn't match expected pattern)
3. Text-based: \`text=Exact Match\` or \`:text('Partial match')\`
4. Role-based: \`[role="button"]\` with text or label
5. Form element attributes: \`[placeholder="Enter value"]\`
6. Aria attributes: \`[aria-label="Description"]\`
7. CSS selectors with class combinations as a last resort

## ACTION SPECIFICATIONS
- "fill": For text inputs, textareas, or contenteditable elements
- "select": For dropdown menus (<select> elements)
- "click": For buttons, checkboxes, or to expand collapsed sections
- "check": For checkbox elements when they need to be checked
- "uncheck": For checkbox elements when they need to be unchecked

## CRITICAL WORKFLOW RULES
- A panel is collapsed when its chevron has class \`rotate-180\`
- I must click to expand a section BEFORE interacting with its fields
- After expanding a section, I will IMMEDIATELY list ALL actions for that section
- I will VERIFY each selector exists in the HTML before using it in actions
- If a presumed selector doesn't exist, I will search for alternatives (e.g., #medications instead of #currentMedications)
- I will complete the form with a submit action if a submit button exists

## EXAMPLE OUTPUT STRUCTURE
[
  {"type":"click","selector":"button:has-text('Medical Information')"},
  {"type":"select","selector":"#gender","value":"Female"},
  {"type":"select","selector":"#bloodType","value":"O+"},
  {"type":"fill","selector":"#allergies","value":"Peanuts"},
  {"type":"fill","selector":"#medications","value":"Ibuprofen"},
  {"type":"click","selector":"button:has-text('Emergency Contact')"},
  {"type":"fill","selector":"#emergencyContact","value":"Michael Chen"},
  {"type":"fill","selector":"#emergencyPhone","value":"555-123-4567"},
  {"type":"click","selector":"button[type='submit']"}
]
I will return ONLY a valid JSON array of actions without any additional text or explanation.
`;
} // also this prompt can definetly be improved, it is a bit too verbose and could be more concise, but it does the job for now.



export function createFormFillingPrompt(data: FormData): string {
  return `
I need to fill out a form with the following data:
${JSON.stringify(data, null, 2)}

Analyze the form and provide a JSON array of actions to fill out all the fields and submit the form.
Each action should have a 'type' ('fill', 'select', 'click') and a 'selector' that will work with Playwright.
For 'fill' actions, also include a 'value' field.

Return ONLY a valid JSON array of actions without any additional text or explanation.
`;
}

export function createHealthDataGenerationPrompt(baseData: FormData, healthLevel: HealthLevel): string {
  return `
You are an AI assistant that generates realistic medical data for test purposes. 
Based on the health level "${healthLevel}", generate appropriate medical information for a patient.

Base patient information:
${JSON.stringify(baseData, null, 2)}

Generate a complete patient profile with realistic:
- Gender
- Blood type
- Allergies (if any)
- Current medications (if any)
- Emergency contact information

The health level is "${healthLevel}", which means:
- Perfect: No health issues, no allergies, no medications
- Good: Minor health issues, possibly one allergy, maybe one medication
- Average: Some health issues, a few allergies, some medications
- Bad: Significant health issues, several allergies, multiple medications
- Terrible: Severe health issues, many allergies, extensive medication regimen

Return ONLY a valid JSON object that follows the FormData structure, with no additional text or explanation.
The JSON should include all fields from the base data plus the generated fields.
`;
} // this prompt is more fine but still i have to parse json out of the response so maybe it needs to have a temp of .1