const Report = require('../models/Report');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');

// @desc    Get reports queue for admin review
// @route   GET /api/admin/reports
// @access  Admin Only
exports.getAdminReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('userId', 'name email reputation')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Admin dashboard metrics
    const pendingCount = await Report.countDocuments({ status: 'Pending' });
    const underReviewCount = await Report.countDocuments({ status: 'Under Review' });
    const verifiedCount = await Report.countDocuments({ status: 'Verified' });
    const rejectedCount = await Report.countDocuments({ status: 'Rejected' });
    const flaggedCount = await Report.countDocuments({ flagCount: { $gt: 0 } });

    return res.status(200).json({
      success: true,
      metrics: {
        pending: pendingCount,
        underReview: underReviewCount,
        verified: verifiedCount,
        rejected: rejectedCount,
        flagged: flaggedCount,
        total
      },
      reports,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('getAdminReports error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving admin reports'
    });
  }
};

// @desc    Verify a report (Status: Verified, Badge: Admin Verified)
// @route   PUT /api/admin/reports/:id/verify
// @access  Admin Only
exports.verifyReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = 'Verified';
    report.verificationBadge = 'Admin Verified';
    await report.save();

    // Reward submitter with reputation and Verified Contributor badge
    if (report.userId) {
      await User.findByIdAndUpdate(report.userId, {
        $inc: { reputation: 25 },
        $addToSet: { badges: 'Verified Contributor' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Report has been verified by admin',
      report
    });
  } catch (error) {
    console.error('verifyReport error:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying report' });
  }
};

// @desc    Reject a report
// @route   PUT /api/admin/reports/:id/reject
// @access  Admin Only
exports.rejectReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = 'Rejected';
    await report.save();

    return res.status(200).json({
      success: true,
      message: 'Report marked as rejected',
      report
    });
  } catch (error) {
    console.error('rejectReport error:', error);
    return res.status(500).json({ success: false, message: 'Server error rejecting report' });
  }
};

// @desc    Remove spam report
// @route   DELETE /api/admin/reports/:id
// @access  Admin Only
exports.deleteSpamReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    await Vote.deleteMany({ reportId: report._id });
    await Comment.deleteMany({ reportId: report._id });
    await report.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Spam report and associated activity permanently purged'
    });
  } catch (error) {
    console.error('deleteSpamReport error:', error);
    return res.status(500).json({ success: false, message: 'Server error purging spam report' });
  }
};

// @desc    Delete offending comment
// @route   DELETE /api/admin/comments/:id
// @access  Admin Only
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    await Report.findByIdAndUpdate(comment.reportId, { $inc: { commentsCount: -1 } });
    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Offending comment deleted by moderator'
    });
  } catch (error) {
    console.error('deleteComment error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting comment' });
  }
};
