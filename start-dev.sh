#!/bin/bash

# Start server and client in development mode
echo "Starting Village Shopkeeper Application in development mode..."

# Check if .env exists, create example if not
if [ ! -f .env ]; then
  echo "WARNING: .env file not found. Creating example .env file..."
  cat > .env << EOL
# Claude API key - Replace this with your actual API key
CLAUDE_API_KEY=your_api_key_here

# Optional Claude API configuration
CLAUDE_API_MODEL=claude-3-opus-20240229

# Server configuration
SERVER_URL=http://localhost:3001

# Client configuration 
# CLIENT_API_URL will override the auto-generated API URL if set
# CLIENT_API_URL=http://your-custom-api-url/api
EOL
  echo "Created example .env file. Please edit it with your actual API key."
  exit 1
fi

# Generate client-side env config from .env
echo "Generating client environment config from .env..."
node generate-env-config.js

# Start server in background
echo "Starting server..."
cd server
npm install
npm run dev &
SERVER_PID=$!
cd ..

# Start client
echo "Starting client..."
npx serve -s . &
CLIENT_PID=$!

# Function to handle termination
function cleanup {
  echo "Shutting down..."
  kill $SERVER_PID
  kill $CLIENT_PID
  exit
}

# Set up trap to call cleanup function when script is terminated
trap cleanup INT TERM

# Keep script running
echo "Development environment running!"
echo "Client available at: http://localhost:3000"
echo "Server API available at: http://localhost:3001/api"
echo "Press Ctrl+C to stop all services"
wait 