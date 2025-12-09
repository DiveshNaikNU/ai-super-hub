const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Chat = require('../models/Chat');
const { catchAsync } = require('../middlewares/error.middleware');

exports.getUserStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const enrollmentsCount = await Enrollment.countDocuments({ user: userId });
  const completedCourses = await Enrollment.countDocuments({ user: userId, 'progress.completed': true });
  const chatSessionsCount = await Chat.countDocuments({ user: userId });
  const user = await User.findById(userId);
  const bookmarkedToolsCount = user.bookmarkedTools?.length || 0;

  const enrollments = await Enrollment.find({ user: userId }).populate('course', 'duration');
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
      favoritePromptsCount: 0,
      learningHours: Math.round(totalLearningHours * 10) / 10
    }
  });
});
