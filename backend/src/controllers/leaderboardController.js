const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Get top community contributors leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ role: { $ne: 'admin' } })
      .select('name reputation badges profileImage createdAt')
      .sort({ reputation: -1 })
      .limit(20);

    // Enrich with verified report counts for each top user
    const leaderboard = await Promise.all(
      topUsers.map(async (user, index) => {
        const verifiedCount = await Report.countDocuments({
          userId: user._id,
          status: 'Verified'
        });
        const totalCount = await Report.countDocuments({
          userId: user._id
        });

        return {
          rank: index + 1,
          _id: user._id,
          name: user.name,
          reputation: user.reputation,
          badges: user.badges,
          profileImage: user.profileImage,
          verifiedReports: verifiedCount,
          totalReports: totalCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('getLeaderboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    });
  }
};
