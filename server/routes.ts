import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { dreamInputSchema, DreamInput } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GeminiClient } from "./gemini";
import { mockAnalyzeDream } from "./mock-dream-analyzer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug environment loading
  console.log('Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    keyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT_SET'
  });
  
  // Initialize Gemini API client if API key is available
  const gemini = process.env.GEMINI_API_KEY ? new GeminiClient(process.env.GEMINI_API_KEY) : null;
  
  if (!gemini) {
    console.log('No Gemini API key found, using mock analyzer');
  }

  // API routes
  app.post("/api/dreams/analyze", async (req, res) => {
    let dreamInput: DreamInput | undefined;
    try {
      dreamInput = dreamInputSchema.parse(req.body);
      
// Call Gemini API to analyze the dream
      const dreamAnalysis = await analyzeDream(gemini, dreamInput);
      
      // Save dream with analysis
      const savedDream = await storage.createDream({
        title: dreamInput.title || null,
        dreamCues: dreamInput.dreamCues,
        isRecurring: dreamInput.isRecurring,
        primaryEmotion: dreamInput.primaryEmotion,
        wakeFeeling: dreamInput.wakeFeeling,
        additionalEmotions: dreamInput.additionalEmotions || null,
        dreamNarrative: dreamAnalysis.dreamNarrative,
        psychologicalReport: dreamAnalysis.psychologicalReport
      });
      
      return res.status(200).json({ 
        id: savedDream.id,
        ...dreamAnalysis 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: fromZodError(error).message
        });
      }
      
      console.error("Error analyzing dream:", {
        error: error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        dreamInput: {
          titleLength: dreamInput?.title?.length || 0,
          dreamCuesLength: dreamInput?.dreamCues?.length || 0,
          emotion: dreamInput?.primaryEmotion || 'unknown'
        }
      });
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      return res.status(500).json({
        message: "Failed to analyze dream",
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      });
    }
  });

  app.get("/api/dreams", async (req, res) => {
    try {
      const dreams = await storage.getAllDreams();
      return res.status(200).json(dreams);
    } catch (error) {
      console.error("Error fetching dreams:", error);
      return res.status(500).json({
        message: "Failed to fetch dreams",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/dreams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid dream ID" });
      }
      
      const dream = await storage.getDream(id);
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }
      
      return res.status(200).json(dream);
    } catch (error) {
      console.error("Error fetching dream:", error);
      return res.status(500).json({
        message: "Failed to fetch dream",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function analyzeDream(gemini: GeminiClient | null, dreamInput: DreamInput) {
  try {
    // If no Gemini client, use mock analyzer
    if (!gemini) {
      console.log('No Gemini API key found, using mock analyzer');
      return mockAnalyzeDream(dreamInput);
    }
    
    // Add timeout wrapper for Gemini API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Analysis timeout - please try again with a clearer dream description")), 60000); // 60 second timeout
    });
    
    console.log("Calling Gemini API with model gemini-2.0-flash...");
    
    const analysisPromise = gemini.createChatCompletion({
      messages: [
        {
          role: "system",
          content: `You are an expert in dream interpretation and psychology. 
          
          Analyze the user's dream fragments and emotional context to generate:
          1. A complete, vivid dream narrative (350-500 words) that incorporates all the dream cues provided
          2. A psychological interpretation including key symbols, analysis summary, and reflection questions
          
          Format your response as JSON with the following structure:
          {
            "title": "Creative title for the dream",
            "dreamNarrative": "Full dream narrative...",
            "psychologicalReport": {
              "keySymbols": [
                {
                  "symbol": "Name of dream element",
                  "icon": "A relevant Remix icon name (e.g., 'plant-line', 'home-4-line')",
                  "meaning": "Psychological interpretation of this symbol"
                }
              ],
              "analysisSummary": "Psychological analysis of the dream...",
              "reflectionQuestions": [
                "Question 1 for the dreamer to reflect on",
                "Question 2 for the dreamer to reflect on",
                "Question 3 for the dreamer to reflect on",
                "Question 4 for the dreamer to reflect on"
              ]
            }
          }`
        },
        {
          role: "user",
          content: `Dream Fragments: ${dreamInput.dreamCues}
          Recurring Dream: ${dreamInput.isRecurring ? "Yes" : "No"}
          Primary Emotion: ${dreamInput.primaryEmotion}
          Waking Feeling: ${dreamInput.wakeFeeling}/5 (1=Unsettled, 5=Refreshed)
          Additional Emotional Context: ${dreamInput.additionalEmotions ?? "None provided"}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Race between the API call and timeout
    const response = await Promise.race([analysisPromise, timeoutPromise]) as any;

    console.log("Gemini API Response:", JSON.stringify(response, null, 2));

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from Gemini API");
    }

    const analysisContent = response.choices[0].message.content;
    console.log("Analysis Content (first 500 chars):", analysisContent.substring(0, 500));
    
    const parsed = JSON.parse(analysisContent);
    
    // Validate the response isn't just echoing gibberish
    if (parsed.dreamNarrative && parsed.dreamNarrative.length < 100) {
      throw new Error("Generated analysis appears incomplete");
    }
    
    return parsed;
  } catch (error) {
    console.log("Gemini API failed, using mock dream analyzer instead:", error instanceof Error ? error.message : "Unknown error");
    
    // If it's a validation error, throw it instead of falling back
    if (error instanceof Error && error.message.includes("nonsensical")) {
      throw error;
    }
    
    // Fall back to our mock dream analyzer for other errors
    return mockAnalyzeDream(dreamInput);
  }
}
