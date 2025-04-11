import fetch from 'node-fetch';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface APIError {
  message?: string;
  error?: string;
}

export class DeepSeekAI {
  constructor(private apiKey: string) {}

  async createChatCompletion(params: {
    messages: Array<{ role: string; content: string }>;
    response_format?: { type: string };
  }): Promise<ChatResponse> {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: params.messages,
        temperature: 0.7,
        max_tokens: 2000,
        response_format: params.response_format,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as APIError;
      throw new Error(`DeepSeek API Error: ${error.message || error.error || response.statusText}`);
    }

    const data = await response.json() as ChatResponse;
    return data;
  }
}