/**
 * Minimal test script for OpenAI API connection
 * 
 * This script tests the basic functionality of connecting to OpenAI API
 * and sending a simple message. It includes detailed error handling and
 * logging to help diagnose connection issues.
 */

const { OpenAI } = require('openai');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Log environment information for debugging
console.log('=== ENVIRONMENT INFO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API KEY PRESENT:', !!process.env.THIRDWEB_API_KEY);
console.log('API KEY LENGTH:', process.env.THIRDWEB_API_KEY ? process.env.THIRDWEB_API_KEY.length : 'N/A');
console.log('MODEL:', process.env.OPENAI_MODEL || 'undefined');
console.log('BASE URL:', process.env.OPENAI_BASE_URL || 'default (api.openai.com)');
console.log('========================\n');

// Initialize OpenAI client with detailed logging
async function testOpenAI() {
  try {
    console.log('Initializing OpenAI client...');
    
    // Initialize the client with all configuration options logged
    const config = {
      apiKey: process.env.THIRDWEB_API_KEY
    };
    
    // Only add baseURL if it's defined
    if (process.env.OPENAI_BASE_URL) {
      config.baseURL = process.env.OPENAI_BASE_URL;
      console.log('Using custom baseURL:', config.baseURL);
    } else {
      console.log('Using default OpenAI API URL');
    }
    
    const openai = new OpenAI(config);
    console.log('Client initialized successfully');

    // Try different model options if needed
    const modelOptions = [
      process.env.OPENAI_MODEL
    ].filter(Boolean);
    
    console.log('Will try these models in order:', modelOptions);
    
    // Try each model until one works
    let success = false;
    let lastError = null;
    
    for (const model of modelOptions) {
      try {
        console.log(`\nAttempting to use model: ${model}`);
        
        const requestPayload = {
          model: model,
          messages: [
           // { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello!' }
          ]
        };
        
        console.log('Request payload:', JSON.stringify(requestPayload, null, 2));
        
        console.log('Sending request...');
        const response = await openai.chat.completions.create(requestPayload);
        
        console.log('Response received!');
        console.log('Response object keys:', Object.keys(response));
        console.log('First choice:', response.choices[0]);
        console.log('Full response message:', response.choices[0].message.content);
        
        success = true;
        console.log(`\n✅ SUCCESS with model: ${model}`);
        break;
      } catch (error) {
        console.error(`\n❌ ERROR with model ${model}:`, error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        
        lastError = error;
        console.log(`Trying next model option...\n`);
      }
    }
    
    if (!success) {
      console.error('\n❌ All model options failed');
      console.error('Last error:', lastError);
    }
    
  } catch (error) {
    console.error('❌ GLOBAL ERROR:', error);
    process.exit(1);
  }
}

// Run the test
testOpenAI(); 