import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionUserMessageParam, ChatCompletionSystemMessageParam } from "openai/resources/chat/completions";

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIClient {
  private openai: OpenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({ apiKey });
  }

  async createChatCompletion(params: {
    messages: Array<{ role: string; content: string }>;
    response_format?: { type: string };
  }): Promise<ChatResponse> {
    try {
      // Convert messages to the correct format expected by the OpenAI API
      const messages: ChatCompletionMessageParam[] = params.messages.map(msg => {
        if (msg.role === "system") {
          return {
            role: "system",
            content: msg.content
          } as ChatCompletionSystemMessageParam;
        } else if (msg.role === "user") {
          return {
            role: "user",
            content: msg.content
          } as ChatCompletionUserMessageParam;
        } else {
          return {
            role: "assistant",
            content: msg.content
          };
        }
      });

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        response_format: params.response_format?.type === "json_object" 
          ? { type: "json_object" } 
          : undefined,
      });

      return {
        choices: [
          {
            message: {
              content: response.choices[0].message.content || "",
            },
          },
        ],
      };
    } catch (error) {
      console.error("OpenAI API Error Details:", {
        error: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        apiKey: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT_SET'
      });
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          throw new Error('OpenAI API key is invalid or expired. Please check your API key.');
        }
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
        if (error.message.includes('quota') || error.message.includes('billing')) {
          throw new Error('OpenAI API quota exceeded. Please check your billing and usage limits.');
        }
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
          throw new Error('OpenAI API access forbidden. Your API key may not have the required permissions.');
        }
      }
      
      throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}