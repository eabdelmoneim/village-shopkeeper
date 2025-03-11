// Script to generate client-side environment configuration from .env
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

// Create a filtered set of environment variables for the client
// Only expose variables with CLIENT_ prefix
const clientEnv = {};

// Add the API_URL directly from the SERVER_URL or default
clientEnv.API_URL = process.env.CLIENT_API_URL || 
                   (process.env.SERVER_URL ? `${process.env.SERVER_URL}/api` : 'http://localhost:3001/api');

// Generate JavaScript content
const jsContent = `// This file is auto-generated from .env - DO NOT EDIT DIRECTLY
// Generated on: ${new Date().toISOString()}
(function() {
    window.ENV = ${JSON.stringify(clientEnv, null, 4)};
    console.log('Client environment configuration loaded from .env');
})();
`;

// Write the file
fs.writeFileSync(path.join(__dirname, 'env-config.js'), jsContent);
console.log('Generated env-config.js from .env variables'); 