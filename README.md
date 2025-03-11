# Village Shopkeeper with Claude AI Integration

An interactive 3D marketplace scene featuring a Turkish bazaar shopkeeper powered by Claude AI.

## Features

- 3D medieval village scene with a potion shop
- Interactive shopkeeper character with dialog
- Knight player character that can move around the scene
- Colorful potion bottles on display shelves
- Sword for sale
- Magic crystal with glowing effects
- Buy and sell system with currency

## Updated Architecture

The application has been rearchitected to use a client-server model for handling Claude AI interactions:

1. **Client**: The browser-based 3D application that renders the scene and handles user interactions
2. **Server**: A Node.js backend that securely communicates with the Claude API

This architecture provides several benefits:
- Properly secures the Claude API key (server-side only)
- Uses the official Anthropic Node.js SDK in its intended environment
- Allows for future expansion and more complex AI features

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/village-shopkeeper.git
cd village-shopkeeper
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

The project uses a single `.env` file for both server and client configuration:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Or just run `./start-dev.sh` which will create an example .env file if one doesn't exist.

2. Edit the `.env` file with your settings:
   ```
   # Claude API key
   CLAUDE_API_KEY=your_api_key_here
   
   # Optional Claude API configuration
   CLAUDE_API_MODEL=claude-3-opus-20240229
   
   # Server configuration
   SERVER_URL=http://localhost:3001
   
   # Client configuration (optional)
   # CLIENT_API_URL=http://your-custom-api-url/api
   ```

### 4. Running the Application

Start both the client and server with a single command:

```bash
npm start
# Or directly:
./start-dev.sh
```

This will:
1. Generate the client-side environment configuration from your .env file
2. Start the Node.js server
3. Serve the client application

The application will be available at:
- Client: http://localhost:3000
- Server API: http://localhost:3001/api

### 5. Interacting with the Shopkeeper

1. Open your browser to the client URL (typically http://localhost:3000)
2. Enter an ENS name or Ethereum wallet address on the welcome screen
3. Approach the shopkeeper in the 3D scene
4. Type messages in the chat interface to haggle with the Turkish bazaar merchant
5. Try asking about his wares, negotiating prices, or inquiring about the sword!

## Fallback Behavior

If the Claude API isn't configured correctly or experiences an error, the application will automatically fall back to using pre-programmed responses. This ensures the app remains functional even without a working API connection.

## Technical Implementation

- The application uses the Claude Messages API (v1)
- Conversations maintain context through the entire interaction
- The shopkeeper's character is defined by a detailed system prompt on the server side
- Environment variables are managed in a single .env file
- Client-side configuration is automatically generated from the .env file at startup

## Controls

- **Movement**: WASD or Arrow Keys (in full version)
- **Interact**: Click on objects or characters
- **Camera**: Click and drag to rotate, scroll to zoom

## Project Structure

```
village-shopkeeper/
├── index.html              # Main application (self-contained)
├── test.html               # Simplified test version
├── .env                    # Environment variables for both client and server
├── generate-env-config.js  # Script to generate client-side config from .env
├── env-config.js           # Auto-generated client-side config (gitignored)
├── styles/                 # CSS and styling
├── assets/                 # For future textures/models
├── node_modules/           # Dependencies
├── package.json            # Project configuration
├── server/                 # Backend API server
│   ├── server.js           # Express server setup
│   ├── controllers/        # API logic
│   ├── routes/             # API routes
├── start-dev.sh            # Development startup script
└── README.md               # This file
```

## Troubleshooting

If you encounter issues:
1. Check that your .env file exists and contains a valid Claude API key
2. Verify that the server is running (check for messages in the terminal)
3. Ensure your browser supports WebGL 
4. Check the browser console for any JavaScript errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for providing a powerful WebGL library
- Concept art that inspired this implementation 