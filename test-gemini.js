// Simple test to verify Gemini API integration
const { GeminiClient } = require('./server/gemini.ts');

async function testGeminiIntegration() {
  try {
    const client = new GeminiClient('AIzaSyC0yACuoL5olGvFhrrwLupuf1rTj_KfL2k');
    
    console.log('Testing Gemini API integration...');
    
    const response = await client.createChatCompletion({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with a simple greeting.'
        },
        {
          role: 'user',
          content: 'Hello, can you confirm the connection is working?'
        }
      ]
    });
    
    console.log('✅ Gemini API Response:', response.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Gemini API Test Failed:', error.message);
  }
}

testGeminiIntegration();
