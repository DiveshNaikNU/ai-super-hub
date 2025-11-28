/**
 * @fileoverview Gemini AI Service
 * @description Handles communication with Google's Gemini API
 * 
 * @author AI Super Hub Team
 * @version 2.0.0
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// Initialize Gemini AI
let genAI = null;

// Available models (updated for 2025)
const AVAILABLE_MODELS = {
  'gemini-flash': 'gemini-2.0-flash',
  'gemini-pro': 'gemini-2.5-pro',
  'gemini-2.0-flash': 'gemini-2.0-flash',
  'gemini-2.5-flash': 'gemini-2.5-flash',
  'gemini-2.5-pro': 'gemini-2.5-pro',
  // Legacy mappings
  'gemini-1.5-flash': 'gemini-2.0-flash',
  'gemini-1.5-pro': 'gemini-2.5-pro'
};

// Default model
const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * Initialize the Gemini client
 */
const initializeGemini = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'placeholder') {
    logger.warn('Gemini API key not configured');
    return null;
  }
  
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  logger.info('Gemini AI initialized successfully');
  return genAI;
};

/**
 * System prompts for different chat modes
 */
const SYSTEM_PROMPTS = {
  general: `You are a helpful AI assistant. Be concise, friendly, and informative.`,
  
  tutor: `You are an expert tutor and educator. Your role is to:
- Explain concepts clearly and simply
- Use examples and analogies
- Break down complex topics step by step
- Encourage learning and ask guiding questions
- Be patient and supportive`,
  
  coder: `You are an expert programmer and software engineer. Your role is to:
- Write clean, efficient, and well-commented code
- Explain code logic clearly
- Debug and fix issues
- Suggest best practices and optimizations
- Support multiple programming languages`,
  
  summarizer: `You are a summarization expert. Your role is to:
- Condense long content into key points
- Extract main ideas and themes
- Present information in bullet points when helpful
- Maintain accuracy while being concise
- Highlight important details`
};

/**
 * Get the correct model name
 */
const getModelName = (model) => {
  return AVAILABLE_MODELS[model] || DEFAULT_MODEL;
};

/**
 * Generate AI response using Gemini
 */
const generateResponse = async (messages, model = 'gemini-2.0-flash', mode = 'general') => {
  try {
    if (!genAI) {
      initializeGemini();
    }
    
    if (!genAI) {
      return "AI service is not configured. Please set up the Gemini API key.";
    }

    const modelName = getModelName(model);
    logger.debug('Using model', { requested: model, actual: modelName });
    
    const geminiModel = genAI.getGenerativeModel({ model: modelName });
    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;
    const lastMessage = messages[messages.length - 1];
    
    // Build conversation context
    let conversationContext = '';
    if (messages.length > 1) {
      const recentMessages = messages.slice(-10, -1);
      conversationContext = recentMessages.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
    }

    const fullPrompt = conversationContext 
      ? `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${lastMessage.content}\n\nAssistant:`
      : `${systemPrompt}\n\nUser: ${lastMessage.content}\n\nAssistant:`;

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    logger.debug('Gemini response generated', { 
      model: modelName, 
      mode, 
      responseLength: text.length 
    });

    return text;

  } catch (error) {
    logger.error('Gemini API error', { error: error.message, model, mode });
    
    if (error.message.includes('API key')) {
      return "AI service configuration error. Please check the API key.";
    }
    if (error.message.includes('quota')) {
      return "AI service quota exceeded. Please try again later.";
    }
    
    return `Error: ${error.message}`;
  }
};

/**
 * Generate a title for a chat
 */
const generateChatTitle = async (firstMessage) => {
  try {
    if (!genAI) initializeGemini();
    if (!genAI) return firstMessage.substring(0, 50) + '...';

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    const prompt = `Generate a very short title (max 5 words) for a conversation that starts with: "${firstMessage.substring(0, 200)}". Reply with only the title, nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().substring(0, 50) || firstMessage.substring(0, 50);

  } catch (error) {
    logger.error('Error generating chat title', { error: error.message });
    return firstMessage.substring(0, 50) + '...';
  }
};

/**
 * Text analysis (sentiment, summary, keywords)
 */
const analyzeText = async (text, analysisType = 'sentiment') => {
  try {
    if (!genAI) initializeGemini();
    if (!genAI) return { error: 'AI service not configured' };

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    
    const prompts = {
      sentiment: `Analyze the sentiment and respond with JSON only: {"sentiment": "positive/negative/neutral", "confidence": 0.0-1.0, "explanation": "brief"}. Text: "${text}"`,
      summary: `Summarize in 2-3 sentences: "${text}"`,
      keywords: `Extract 5-10 keywords as JSON: {"keywords": ["word1", "word2"]}. Text: "${text}"`
    };

    const result = await model.generateContent(prompts[analysisType] || prompts.sentiment);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch {
      return { result: responseText };
    }

  } catch (error) {
    logger.error('Text analysis error', { error: error.message });
    return { error: 'Analysis failed' };
  }
};

module.exports = {
  initializeGemini,
  generateResponse,
  generateChatTitle,
  analyzeText,
  SYSTEM_PROMPTS,
  AVAILABLE_MODELS,
  DEFAULT_MODEL
};
