import { DreamInput, DreamAnalysis } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function analyzeDream(dreamInput: DreamInput): Promise<DreamAnalysis> {
  try {
    const response = await apiRequest("POST", "/api/dreams/analyze", dreamInput);
    return response.json();
  } catch (error) {
    console.error("Error analyzing dream:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to analyze dream");
  }
}
