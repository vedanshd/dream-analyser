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

  constructor(apiKey: string) {
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
      console.error("OpenAI API Error:", error);
      throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}