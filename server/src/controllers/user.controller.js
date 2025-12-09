/**
 * @fileoverview User controller for user-specific stats
 * @description Handles user statistics and dashboard data
 */

const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Chat = require('../models/Chat');
const Tool = require('../models/Tool');
const { catchAsync } = require('../middlewares/error.middleware');

/**
 * @desc    Get user statistics for dashboard
 * @route   GET /api/users/me/stats
 * @access  Private
 */
exports.getUserStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Get enrollments count
  const enrollmentsCount = await Enrollment.countDocuments({ 
    user: userId 
  });

  // Get completed courses count
  const completedCourses = await Enrollment.countDocuments({ 
    user: userId,
    'progress.completed': true
  });

  // Get chat sessions count
  const chatSessionsCount = await Chat.countDocuments({ 
    user: userId 
  });

  // Get bookmarked tools count
  const user = await User.findById(userId);
  const bookmarkedToolsCount = user.bookmarkedTools?.length || 0;

  // Get favorite prompts count (if you have this field)
  const favoritePromptsCount = user.favoritePrompts?.length || 0;

  // Calculate learning hours (based on enrollments and progress)
  const enrollments = await Enrollment.find({ user: userId })
    .populate('course', 'duration');
  
  let totalLearningHours = 0;
  enrollments.forEach(enrollment => {
    if (enrollment.progress?.percentage) {
      const courseHours = enrollment.course?.duration || 0;
      totalLearningHours += (courseHours * enrollment.progress.percentage) / 100;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      enrollmentsCount,
      completedCourses,
      chatSessionsCount,
      bookmarkedToolsCount,
      favoritePromptsCount,
      learningHours: Math.round(totalLearningHours * 10) / 10,
      recentActivity: {
        lastChatDate: await getLastChatDate(userId),
        lastEnrollmentDate: await getLastEnrollmentDate(userId)
      }
    }
  });
});

// Helper functions
const getLastChatDate = async (userId) => {
  const lastChat = await Chat.findOne({ user: userId })
    .sort('-updatedAt')
    .select('updatedAt');
  return lastChat?.updatedAt || null;
};

const getLastEnrollmentDate = async (userId) => {
  const lastEnrollment = await Enrollment.findOne({ user: userId })
    .sort('-createdAt')
    .select('createdAt');
  return lastEnrollment?.createdAt || null;
};

module.exports = {
  getUserStats
};
