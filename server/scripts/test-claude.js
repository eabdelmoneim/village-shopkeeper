/**
 * Minimal test script for Claude API connection using Anthropic SDK
 * 
 * This script tests the basic functionality of connecting to the Anthropic Claude API
 * and sending a simple message using the official Anthropic SDK.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const Anthropic = require('@anthropic-ai/sdk');

// Log environment information for debugging
console.log('=== ENVIRONMENT INFO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API KEY PRESENT:', !!process.env.CLAUDE_API_KEY);
console.log('API KEY LENGTH:', process.env.CLAUDE_API_KEY ? process.env.CLAUDE_API_KEY.length : 'N/A');
console.log('MODEL:', process.env.CLAUDE_API_MODEL || 'undefined');
console.log('========================\n');

// Initialize Anthropic client and test Claude API
async function testClaudeAPI() {
  try {
    console.log('Initializing Anthropic client...');
    
    // Initialize the Anthropic client with the Claude API key
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
    
    console.log('Client initialized successfully');
    
    // Get available models to confirm which models can be used
    console.log('Model to use:', process.env.CLAUDE_API_MODEL || 'claude-3-opus-20240229');
    
    // Create a message using the Claude API
    console.log('Sending request to Claude API...');
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_API_MODEL || 'claude-3-opus-20240229',
      max_tokens: 300,
      system: "You are a helpful assistant.",
      messages: [
        {
          role: "user",
          content: "Hello! How are you today?"
        }
      ]
    });
    
    console.log('\n✅ SUCCESS! Claude API response:');
    console.log('Response ID:', message.id);
    console.log('Response content:', message.content);
    
  } catch (error) {
    console.error('\n❌ ERROR connecting to Claude API:', error);
    
    if (error.status) {
      console.error('Error status:', error.status);
      console.error('Error type:', error.type);
      console.error('Error message:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the test
testClaudeAPI(); 