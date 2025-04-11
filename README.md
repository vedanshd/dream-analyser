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

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/vedanshd/dream.git
   cd dream
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create an .env file in the root directory and add your API keys (optional)
   ```
   OPENAI_API_KEY=your_openai_key
   ```
4. Start the development server
   ```bash
   npm run dev
   ```
5. Open your browser to: `http://localhost:5000`

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

## Demo

Visit [our GitHub repository](https://github.com/vedanshd/dream) to see the project. Currently, the application is not deployed to a live demo site.

## Deployment

To deploy the application to production:

1. Build the project
   ```bash
   npm run build
   ```
2. The compiled files will be in the `dist` directory
3. Deploy these files to your preferred hosting service

## License

MIT

## Author

Vedansh Dhawan
