# VDreamScape - Dream Analysis Application

A sophisticated dream analysis platform that leverages AI to transform personal dream experiences into insightful psychological narratives and visual explorations.

## Features

- 🌙 **Dream Input**: Submit your dream fragments, emotions, and context
- 🧠 **AI-Powered Analysis**: Get comprehensive dream interpretations
- 📊 **Psychological Insights**: Receive symbol analysis and reflection questions
- 📱 **Responsive Design**: Beautiful interface that works on all devices
- 🌓 **Theme System**: Toggle between light and dark modes

## Technology Stack

- TypeScript
- React
- Express
- OpenAI API (with fallback mock functionality)
- TailwindCSS + ShadcnUI
- React Query

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to: `http://localhost:5000`

## Configuration

For full AI functionality, add your API keys to the environment:

```
OPENAI_API_KEY=your_openai_key
```

If no API key is provided, the application will use a mock dream analyzer that generates sample responses for demonstration purposes.

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared TypeScript types and schemas

## License

MIT

## Author

Vedansh Dhawan