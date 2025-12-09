/**
 * @fileoverview Support message routes
 * @description API endpoints for support messages
 */

const express = require('express');
const router = express.Router();
const SupportMessage = require('../models/SupportMessage');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { catchAsync } = require('../middlewares/error.middleware');

/**
 * @swagger
 * /api/support:
 *   post:
 *     summary: Submit a support message
 *     tags: [Support]
 *     description: Users can submit support requests. Authentication optional - if logged in, user ID will be attached.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               subject:
 *                 type: string
 *                 example: "Help with course enrollment"
 *               message:
 *                 type: string
 *                 example: "I'm having trouble enrolling in the ML course"
 *               category:
 *                 type: string
 *                 enum: [general, technical, billing, course, feature]
 *                 default: general
 *     responses:
 *       201:
 *         description: Support message submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 */
router.post('/', catchAsync(async (req, res) => {
  const { name, email, subject, message, category } = req.body;

  const supportMessage = await SupportMessage.create({
    name,
    email,
    subject,
    message,
    category,
    userId: req.user?._id || null
  });

  res.status(201).json({
    success: true,
    message: 'Support message submitted successfully',
    data: { supportMessage }
  });
}));

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Get all support messages (Admin only)
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in-progress, resolved, closed]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Support messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                     pagination:
 *                       type: object
 *       403:
 *         description: Admin access required
 */
router.get('/', protect, adminOnly, catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const messages = await SupportMessage.find(filter)
    .populate('userId', 'name email')
    .populate('resolvedBy', 'name')
    .sort('-createdAt')
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await SupportMessage.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: { 
      messages,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

/**
 * @swagger
 * /api/support/{id}/status:
 *   put:
 *     summary: Update support message status (Admin only)
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, in-progress, resolved, closed]
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Message not found
 */
router.put('/:id/status', protect, adminOnly, catchAsync(async (req, res) => {
  const { status, adminNotes } = req.body;

  const message = await SupportMessage.findByIdAndUpdate(
    req.params.id,
    { 
      status,
      adminNotes,
      resolvedBy: status === 'resolved' ? req.user._id : undefined,
      resolvedAt: status === 'resolved' ? new Date() : undefined
    },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Support message not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Status updated successfully',
    data: { message }
  });
}));

/**
 * @swagger
 * /api/support/{id}:
 *   delete:
 *     summary: Delete support message (Admin only)
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
router.delete('/:id', protect, adminOnly, catchAsync(async (req, res) => {
  const message = await SupportMessage.findByIdAndDelete(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Support message not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Support message deleted'
  });
}));

module.exports = router;
