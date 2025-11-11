import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GeminiClient {
  private gemini: GoogleGenerativeAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  async createChatCompletion(params: {
    messages: Array<{ role: string; content: string }>;
    response_format?: { type: string };
  }): Promise<ChatResponse> {
    try {
      // Get the Gemini Pro model (using gemini-pro which is more widely available)
      const model = this.gemini.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      });

      // Convert messages to Gemini format
      // Gemini doesn't use system/user/assistant roles in the same way
      // We'll combine system and user messages into a single prompt
      let prompt = "";
      
      for (const message of params.messages) {
        if (message.role === "system") {
          prompt += `System Instructions: ${message.content}\n\n`;
        } else if (message.role === "user") {
          prompt += `User: ${message.content}\n\n`;
        } else if (message.role === "assistant") {
          prompt += `Assistant: ${message.content}\n\n`;
        }
      }

      // Add JSON format instruction if requested
      if (params.response_format?.type === "json_object") {
        prompt += "Please respond only with valid JSON format as specified in the system instructions.";
      }

      // Generate content
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return {
        choices: [
          {
            message: {
              content: text,
            },
          },
        ],
      };
    } catch (error) {
      console.error("Gemini API Error Details:", {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        apiKey: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT_SET'
      });
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
          throw new Error('Gemini API key is invalid. Please check your API key.');
        }
        if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('429')) {
          throw new Error('Gemini API quota exceeded. Please try again later.');
        }
        if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
          throw new Error('Gemini API rate limit exceeded. Please try again later.');
        }
        if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
          throw new Error('Gemini API access forbidden. Your API key may not have the required permissions.');
        }
      }
      
      throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
