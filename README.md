# Village Shopkeeper with Nebula AI Integration

An example interactive three.js 3D marketplace scene featuring a Turkish bazaar shopkeeper powered by [thirdweb Nebula AI](https://portal.thirdweb.com/nebula).

## Scene Flow & Features

1. **Welcome Screen**
   - Users enter their ENS name or Ethereum wallet address
   - The system preloads the initial greeting while preparing the 3D scene

2. **3D Medieval Village Scene**
   - Immersive marketplace environment with a potion shop
   - Interactive shopkeeper character with natural dialog
   - Knight player character that can move around freely
   - Colorful potion bottles on display shelves
   - Magic crystal with glowing effects

3. **Dynamic Sword Pricing System**
   - Powered by a sophisticated SHOPKEEPER_SYSTEM_PROMPT in `server/controllers/aiController.js` that defines the shopkeeper's personality and pricing rules
   - The shopkeeper uses Nebula AI via the [OpenAI chat completions API](https://portal.thirdweb.com/nebula/plugins/openai#chat-completions-api) to check the user's ERC20 token balance on contract 0x4B534D47032B356DBe5FF6F64f339B4b28A4aAC7 on Sepolia network
   - For users with >100k tokens: Starting price of 75 gold
   - For users with ≤100k tokens: Starting price of 25 gold
   - The shopkeeper maintains character by never revealing the connection between token balance and pricing
   - Other items maintain fixed prices regardless of token balance
   - The system prompt ensures consistent character behavior and strict adherence to pricing rules

4. **Interactive Negotiation**
   - Natural conversation flow with the Turkish bazaar merchant
   - Real-time token balance checks during price negotiations
   - Shopkeeper maintains consistent character and pricing rules
   - Users can haggle, ask about items, or inquire about the sword's history

5. **Buy and Sell System**
   - Currency-based trading system
   - Dynamic pricing based on user's token holdings
   - Multiple items available for purchase
   - Natural negotiation flow with the shopkeeper

## Updated Architecture

The application has been rearchitected to use a client-server model for handling AI interactions:

1. **Client**: The browser-based 3D application that renders the scene and handles user interactions
2. **Server**: A Node.js backend that securely communicates with the OpenAI API

This architecture provides several benefits:
- Properly secures the API key (server-side only)
- Uses the official OpenAI SDK in its intended environment
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
   # OpenAI API key
   THIRDWEB_API_KEY=your_api_key_here
   
   # OpenAI API configuration for using Nebula from thirdweb
   OPENAI_MODEL=t0
   OPENAI_BASE_URL=https://nebula-api.thirdweb.com
   
   # Server configuration
   SERVER_URL=http://localhost:3001
   
   # Client configuration (optional)
   # CLIENT_API_URL=http://your-custom-api-url/api
   ```

### 4. Claiming Tokens for Testing

To claim Gold erc20 tokens for testing with your wallet, you can claim directly from the [contract page](https://thirdweb.com/sepolia/0x4B534D47032B356DBe5FF6F64f339B4b28A4aAC7/tokens) on the thirdweb Dashboard 

### 5. Running the Application

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

If the OpenAI API isn't configured correctly or experiences an error, the application will automatically fall back to using pre-programmed responses. This ensures the app remains functional even without a working API connection.

## Technical Implementation

- The application uses the OpenAI Chat Completions API
- Conversations maintain context through the entire interaction
- The shopkeeper's character is defined by a detailed system prompt on the server side
- Environment variables are managed in a single .env file
- Client-side configuration is automatically generated from the .env file at startup

## Controls

- **Movement**: WASD or Arrow Keys (in full version)

## Project Structure

```
village-shopkeeper/
├── index.html              # Main application entry point
├── test.html               # Simplified test version
├── .env                    # Environment variables for both client and server
├── generate-env-config.js  # Script to generate client-side config from .env
├── env-config.js           # Auto-generated client-side config (gitignored)
├── styles/                 # CSS and styling
│   └── styles.css         # Main stylesheet
├── assets/                 # 3D models and textures
│   ├── models/            # 3D model files
│   └── textures/          # Texture files
├── js/                     # JavaScript source files
│   ├── main.js            # Main application logic
│   ├── init.js            # Initialization code
│   ├── utils/             # Utility functions
│   │   ├── materials.js   # Three.js material utilities
│   │   └── math.js        # Math helper functions
│   ├── scene/             # Scene management
│   │   └── scene.js       # Scene setup and management
│   ├── controls/          # Input controls
│   │   └── keyboard.js    # Keyboard input handling
│   └── chat/              # Chat system
│       └── chat.js        # Chat interface and logic
├── server/                 # Backend API server
│   ├── server.js          # Express server setup
│   ├── controllers/       # API logic
│   │   └── aiController.js # AI interaction handling
│   ├── routes/            # API routes
│   │   └── chat.js        # Chat API endpoints
│   └── scripts/           # Server utilities
├── node_modules/          # Dependencies
├── package.json           # Project configuration
├── start-dev.sh           # Development startup script
└── README.md              # This file
```

## Troubleshooting

If you encounter issues:
1. Check that your .env file exists and contains a valid OpenAI API key
2. Verify that the server is running (check for messages in the terminal)
3. Ensure your browser supports WebGL 
4. Check the browser console for any JavaScript errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for providing a powerful WebGL library
- Concept art that inspired this implementation 