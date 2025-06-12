import { anthropic } from "@ai-sdk/anthropic";
import { MODEL } from "../config";

export const model = anthropic(MODEL); 
