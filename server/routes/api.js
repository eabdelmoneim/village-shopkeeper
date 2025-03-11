const express = require('express');
const router = express.Router();
const claudeController = require('../controllers/claudeController');

/**
 * POST /api/chat - Send messages to the shopkeeper and get a response
 * 
 * Request body:
 * {
 *   "messages": [{"role": "user", "content": "Hello"}, ...]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "response": "Shopkeeper's response text"
 * }
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    
    // Validate request body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }
    
    // Get response from Claude using the shopkeeper prompt by default
    let response;
    if (systemPrompt) {
      // For backward compatibility and testing - allow custom prompts if provided
      console.log('Using custom system prompt provided by client');
      response = await claudeController.getChatResponse(messages, systemPrompt);
    } else {
      // Default behavior - use shopkeeper character
      response = await claudeController.getShopkeeperResponse(messages);
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Error in /api/chat endpoint:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred processing your request'
    });
  }
});

/**
 * GET /api/health - Check API health status
 * 
 * Response:
 * {
 *   "status": "ok",
 *   "claudeConnection": true,
 *   "message": "API is healthy"
 * }
 */
router.get('/health', async (req, res) => {
  try {
    // Check Claude API connection
    const claudeConnection = await claudeController.checkClaudeConnection();
    
    return res.status(200).json({
      status: 'ok',
      claudeConnection,
      message: claudeConnection ? 'API is healthy' : 'Claude API connection failed'
    });
  } catch (error) {
    console.error('Error in /api/health endpoint:', error);
    
    return res.status(500).json({
      status: 'error',
      claudeConnection: false,
      message: error.message || 'Health check failed'
    });
  }
});

module.exports = router; 