const { OpenAI } = require('openai');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.THIRDWEB_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://nebula-api.thirdweb.com"
});

// Default model to use if not specified in environment
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4-1106-preview';

// Shopkeeper system prompt - moved from client-side for better security and consistency
const SHOPKEEPER_SYSTEM_PROMPT = `
You are a shopkeeper in a busy Turkish bazaar in a medieval fantasy world. 

YOUR PERSONALITY:
- You are friendly but shrewd, always looking to make the best deal possible.
- You speak with a subtle Turkish accent, using occasional Turkish phrases like "Buyurun" (Here you go), "Efendim" (Sir/Madam), or "Teşekkür ederim" (Thank you).
- You are proud of your merchandise and boast about their quality.
- You start with high prices and expect customers to haggle - in fact, you respect those who negotiate well.
- You are dramatic and expressive, using colorful descriptions and hand gestures (which you can describe in *asterisks*).

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
- Keep your responses relatively brief (1-3 short paragraphs).
- Don't discuss topics unrelated to your shop or merchandise.
- Never break character or acknowledge you're an AI.
- If asked about the user's wallet address, you can acknowledge it, but quickly return to selling your wares.

CUSTOMER INFORMATION:
- The customer's wallet address or ENS name is: {{address}}
- If the address ends with .eth, refer to them by their name without the .eth suffix.
- If it's a wallet address (starts with 0x), you can just call them "honored guest" or "traveler".
- Occasionally reference their address or name to add a personal touch, especially when trying to close a sale.
`;

/**
 * Get a response from OpenAI Chat Completions API for the provided messages
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} [customSystemPrompt] - Optional custom system instructions
 * @param {String} [userAddress] - Optional user's wallet address or ENS name
 * @returns {Promise<String>} - OpenAI's response text
 */
exports.getChatResponse = async (messages, customSystemPrompt = null, userAddress = null) => {
  try {
    // Validate inputs
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }
    
    // Use the shopkeeper system prompt by default, or custom prompt if provided
    let systemPrompt = customSystemPrompt || SHOPKEEPER_SYSTEM_PROMPT;
    
    // If userAddress is provided, replace the placeholder in the system prompt
    if (userAddress) {
      systemPrompt = systemPrompt.replace(/{{address}}/g, userAddress);
      console.log(`Injected user address (${userAddress.slice(0, 8)}...) into system prompt`);
    } else {
      // If no address is provided, replace with generic placeholder
      systemPrompt = systemPrompt.replace(/{{address}}/g, 'unknown');
    }

    // Format messages for OpenAI
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    console.log('Sending request to OpenAI API with:', { 
      messageCount: messages.length,
      systemPromptLength: systemPrompt.length,
      usingDefaultPrompt: !customSystemPrompt,
      hasUserAddress: !!userAddress
    });
    
    // Create the chat completion request to OpenAI
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: formattedMessages,
      // max_tokens: 1000,
      // temperature: 0.7
    });

    // Extract and return just the text content from OpenAI's response
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw error;
  }
};

/**
 * Get a response from the shopkeeper character
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} [userAddress] - Optional user's wallet address or ENS name
 * @returns {Promise<String>} - Shopkeeper's response text
 */
exports.getShopkeeperResponse = async (messages, userAddress = null) => {
  return this.getChatResponse(messages, null, userAddress); // Uses default shopkeeper prompt
};

/**
 * Healthcheck function to verify OpenAI API connection
 * @returns {Promise<Boolean>} - True if OpenAI API is accessible
 */
exports.checkOpenAIConnection = async () => {
  try {
    // Send a minimal request to check if the API is working
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello?' }
      ],
      max_tokens: 10
    });
    
    return !!response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API connection check failed:', error);
    return false;
  }
};

// Export the health check with a more general name for backwards compatibility
exports.checkClaudeConnection = exports.checkOpenAIConnection; 