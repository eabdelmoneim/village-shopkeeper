# Village Shopkeeper API Server

This is the backend server for the Village Shopkeeper application. It serves as a proxy between the frontend application and the Claude AI service.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Make sure your .env file is correctly configured:
```
CLAUDE_API_KEY=your_api_key_here
CLAUDE_API_MODEL=claude-3-opus-20240229
PORT=3001
```

### Running the Server

Start the server in development mode:
```bash
npm run dev
```

Start the server in production mode:
```bash
npm start
```

## API Endpoints

### POST /api/chat
Send messages to the Claude-powered shopkeeper.

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "Hello shopkeeper!" }
  ],
  "systemPrompt": "You are a shopkeeper in a busy Turkish bazaar in a medieval fantasy world..."
}
```

Response:
```json
{
  "success": true,
  "response": "Merhaba, welcome to my humble shop! *bows slightly* I am Kemal, purveyor of the finest weapons and magical items in all the bazaar..."
}
```

## Architecture

This server provides a simple API layer between the frontend and the Claude AI API. It handles:

1. Authentication with Claude using the API key
2. Message formatting and context management
3. Error handling
4. Rate limiting and request optimization

The server is built with Express.js and uses the official Anthropic Node.js SDK to communicate with the Claude API. 