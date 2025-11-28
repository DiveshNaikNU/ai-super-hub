/**
 * @fileoverview Chat controller
 * @description Handles AI chat operations
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const Chat = require('../models/Chat');
const { validationResult } = require('express-validator');
const { catchAsync } = require('../middlewares/error.middleware');
const { generateResponse, generateChatTitle } = require('../services/gemini.service');
const logger = require('../utils/logger');

/**
 * @desc    Get all chats for current user
 * @route   GET /api/chats
 * @access  Private
 */
exports.getChats = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, mode } = req.query;

  const filter = { user: req.user._id, isActive: true };
  if (mode) filter.mode = mode;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const chats = await Chat.find(filter)
    .select('title model mode messageCount createdAt updatedAt')
    .sort('-updatedAt')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Chat.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: 'Chats retrieved successfully',
    data: { chats },
    meta: {
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalItems: total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

/**
 * @desc    Get single chat with messages
 * @route   GET /api/chats/:id
 * @access  Private
 */
exports.getChat = catchAsync(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Chat retrieved successfully',
    data: { chat }
  });
});

/**
 * @desc    Create new chat
 * @route   POST /api/chats
 * @access  Private
 */
exports.createChat = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { model, mode, title } = req.body;

  const chat = await Chat.create({
    user: req.user._id,
    model: model || 'gemini-2.0-flash',
    mode: mode || 'general',
    title: title || 'New Chat',
    messages: []
  });

  logger.info('New chat created', { chatId: chat._id, userId: req.user._id });

  res.status(201).json({
    success: true,
    message: 'Chat created successfully',
    data: { chat }
  });
});

/**
 * @desc    Send message and get AI response
 * @route   POST /api/chats/:id/message
 * @access  Private
 */
exports.sendMessage = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { message } = req.body;

  // Find the chat
  const chat = await Chat.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found'
    });
  }

  // Add user message
  chat.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  });

  // Generate AI response
  const aiResponse = await generateResponse(
    chat.messages,
    chat.model,
    chat.mode
  );

  // Add AI response
  chat.messages.push({
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date()
  });

  // Generate title if this is the first message
  if (chat.messages.length === 2 && chat.title === 'New Chat') {
    chat.title = await generateChatTitle(message);
  }

  await chat.save();

  logger.debug('Message sent', { chatId: chat._id, messageCount: chat.messageCount });

  res.status(200).json({
    success: true,
    message: 'Message sent successfully',
    data: {
      userMessage: chat.messages[chat.messages.length - 2],
      assistantMessage: chat.messages[chat.messages.length - 1],
      chat: {
        _id: chat._id,
        title: chat.title,
        messageCount: chat.messageCount
      }
    }
  });
});

/**
 * @desc    Quick chat (create chat and send message in one request)
 * @route   POST /api/chats/quick
 * @access  Private
 */
exports.quickChat = catchAsync(async (req, res) => {
  const { message, model, mode } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }

  // Create new chat with initial message
  const chat = await Chat.create({
    user: req.user._id,
    model: model || 'gemini-2.0-flash',
    mode: mode || 'general',
    title: 'New Chat',
    messages: [{
      role: 'user',
      content: message,
      timestamp: new Date()
    }]
  });

  // Generate AI response
  const aiResponse = await generateResponse(
    chat.messages,
    chat.model,
    chat.mode
  );

  // Add AI response
  chat.messages.push({
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date()
  });

  // Generate title
  chat.title = await generateChatTitle(message);

  await chat.save();

  logger.info('Quick chat created', { chatId: chat._id });

  res.status(201).json({
    success: true,
    message: 'Chat created successfully',
    data: { chat }
  });
});

/**
 * @desc    Update chat title
 * @route   PUT /api/chats/:id
 * @access  Private
 */
exports.updateChat = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { title } = req.body;

  const chat = await Chat.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title },
    { new: true }
  );

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Chat updated successfully',
    data: { chat }
  });
});

/**
 * @desc    Delete chat
 * @route   DELETE /api/chats/:id
 * @access  Private
 */
exports.deleteChat = catchAsync(async (req, res) => {
  const chat = await Chat.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found'
    });
  }

  logger.info('Chat deleted', { chatId: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Chat deleted successfully',
    data: null
  });
});

/**
 * @desc    Clear all chats for user
 * @route   DELETE /api/chats
 * @access  Private
 */
exports.clearAllChats = catchAsync(async (req, res) => {
  await Chat.deleteMany({ user: req.user._id });

  logger.info('All chats cleared', { userId: req.user._id });

  res.status(200).json({
    success: true,
    message: 'All chats deleted successfully',
    data: null
  });
});
