import { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { generateText } from "ai";
import { model } from "../_internal/setup";
import { FormData, HealthLevel } from "../types";
import { createFormFillingPrompt, createHealthDataGenerationPrompt, createHtmlAnalysisPrompt, systemPrompt } from "./prompt";

export type Action =
  | { type: "fill"; selector: string; value: string }
  | { type: "click"; selector: string }
  | { type: "select"; selector: string; value: string };

export async function getActionPlan(data: FormData): Promise<Action[]> {
  console.log("Creating prompt for AI agent...");
  const prompt = `${systemPrompt}\n${createFormFillingPrompt(data)}`;
  console.log("Sending prompt to AI model...");
  
  try {
    const res = await generateText({ model, prompt });
    console.log("Received response from AI model");
    console.debug("Response text:", res.text);
    try {
      const parsedActions = JSON.parse(res.text) as Action[];
      console.log(`Successfully parsed ${parsedActions.length} actions from response`);
      return parsedActions;
    } catch (err) {
      console.error("Failed to parse action plan from AI response");
      console.error("Raw response text:", res.text);
      throw new Error(`Failed to parse action plan: ${res.text}`);
    }
  } catch (err) {
    console.error("Error generating text from AI model:", err);
    throw err;
  }
}

export async function getActionPlanWithHtml(data: FormData, html: string): Promise<Action[]> {
  console.log("Creating HTML analysis prompt for AI agent...");
  const prompt = `${systemPrompt}\n${createHtmlAnalysisPrompt(data, html)}`;
  console.log("Sending HTML analysis prompt to AI model ( this will take some time)...");

  const res = await generateText({
    model: model, 
    prompt: prompt,
    providerOptions: {
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 }, // thinking is needed this is a pretty complex task, i mentioned this in the readme but i think a agentic loop here would work better.
    } satisfies AnthropicProviderOptions,
  },
  });

  try {
    let jsonText = res.text;
    if (jsonText.includes("```")) {
      jsonText = jsonText.split("```").filter((_, i) => i % 2 === 1).join("");
      if (jsonText.startsWith("json\n")) {
        jsonText = jsonText.substring(5);
      }
    }
    
    const parsedActions = JSON.parse(jsonText) as Action[];
    console.log(`Successfully parsed ${parsedActions.length} actions from response`);
    return parsedActions;
  } catch (err) {
    console.error("Error parsing actions from AI response:", err);
    console.error("Raw AI response text:", res.text);
    throw new Error("Failed to parse actions from AI response.");
  }
}

// Function to generate form data based on health level
export async function generateHealthData(baseData: FormData, level: HealthLevel): Promise<FormData> {
  console.log(`Generating health data based on health level: ${level}...`);
  const prompt = `${systemPrompt}\n${createHealthDataGenerationPrompt(baseData, level)}`;
  
  const res = await generateText({
    model: model, // Use the configured model from setup doesnt need thinking and honestly it can be a cheaper model.
    prompt: prompt,
  });

  try {
    let jsonText = res.text;
    if (jsonText.includes("```")) {
      jsonText = jsonText.split("```").filter((_, i) => i % 2 === 1).join("");
      if (jsonText.startsWith("json\n")) {
        jsonText = jsonText.substring(5);
      }
    }
    const parsedData = JSON.parse(jsonText) as FormData;
    console.log("Successfully parsed generated health data from AI response");
    return { ...baseData, ...parsedData }; 
  } catch (err) {
    console.error("Error parsing health data from AI response:", err);
    console.error("Raw AI response text:", res.text);
    throw new Error("Failed to parse health data from AI response.");
  }
}