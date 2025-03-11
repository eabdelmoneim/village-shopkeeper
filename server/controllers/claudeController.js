const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

// Initialize the Anthropic client with the API key from environment variables
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Default model to use if not specified in environment
const DEFAULT_MODEL = 'claude-3-opus-20240229';

// Shopkeeper system prompt - moved from client-side for better security and consistency
const SHOPKEEPER_SYSTEM_PROMPT = `
You are a shopkeeper in a busy Turkish bazaar in a medieval fantasy world. 

YOUR PERSONALITY:
- You are friendly but shrewd, always looking to make the best deal possible.
- You speak with a subtle Turkish accent, using occasional Turkish phrases like "Efendim" (Sir/Madam)
- You are proud of your merchandise and boast about their quality.
- You start with high prices and expect customers to haggle - in fact, you respect those who negotiate well.
- be brief and concise not too long. keep it short and sweet.

YOUR SHOP:
- You sell weapons (primarily swords), potions, and magical items.
- Your most expensive item is a finely crafted steel sword (25 gold coins) which you should try to sell at a premium price.
- You also have:
  * Healing potions (5 gold)
  * Magic crystal (50 gold but worth the price for its rare enchantments)
  * Various other smaller weapons and items

YOUR GOALS:
- Convince the customer to buy your most expensive items, especially the sword.
- If they show interest in cheaper items, try to upsell them to more expensive ones.
- Always compliment the customer and make them feel special, but be persistent in your sales pitch.
- If they try to leave without buying, offer a small "special discount just for them."

CONSTRAINTS:
- Keep your responses relatively brief (1-2 sentences).
- Don't discuss topics unrelated to your shop or merchandise.
- Never break character or acknowledge you're an AI.
- If asked about the user's wallet address, you can acknowledge it, but quickly return to selling your wares.
`;

/**
 * Get a response from Claude for the provided messages
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} [customSystemPrompt] - Optional custom system instructions
 * @returns {Promise<String>} - Claude's response text
 */
exports.getChatResponse = async (messages, customSystemPrompt = null) => {
  try {
    // Validate inputs
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }
    
    // Use the shopkeeper system prompt by default, or custom prompt if provided
    const systemPrompt = customSystemPrompt || SHOPKEEPER_SYSTEM_PROMPT;

    console.log('Sending request to Claude API with:', { 
      messageCount: messages.length,
      systemPromptLength: systemPrompt.length,
      usingDefaultPrompt: !customSystemPrompt
    });

    // Use the model specified in environment variables or fall back to default
    const modelToUse = process.env.CLAUDE_API_MODEL || DEFAULT_MODEL;
    
    // Create the message request to Claude API using latest SDK format
    const response = await anthropic.messages.create({
      model: modelToUse,
      system: systemPrompt,
      messages: messages,
      max_tokens: 1000,
    });

    // Extract and return just the text content from Claude's response
    return response.content[0].text;
  } catch (error) {
    console.error('Error with Claude API:', error);
    throw error;
  }
};

/**
 * Get a response from the shopkeeper character
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<String>} - Shopkeeper's response text
 */
exports.getShopkeeperResponse = async (messages) => {
  return this.getChatResponse(messages); // Uses default shopkeeper prompt
};

/**
 * Healthcheck function to verify Claude API connection
 * @returns {Promise<Boolean>} - True if Claude API is accessible
 */
exports.checkClaudeConnection = async () => {
  try {
    // Send a minimal request to check if the API is working
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_API_MODEL || DEFAULT_MODEL,
      system: "You are a helpful assistant.",
      messages: [{ role: "user", content: "Hello?" }],
      max_tokens: 10,
    });
    
    return !!response.content[0].text;
  } catch (error) {
    console.error('Claude API connection check failed:', error);
    return false;
  }
}; 