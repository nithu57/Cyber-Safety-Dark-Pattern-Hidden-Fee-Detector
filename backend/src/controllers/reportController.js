const validator = require('validator');
const Report = require('../models/Report');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { analyzeScreenshotOrUrl } = require('../services/aiDetector');

function extractDomain(url) {
  try {
    const formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, '');
  } catch (err) {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }
}

// @desc    Get all reports with filters, search, and pagination
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res) => {
  try {
    const {
      search,
      category,
      riskLevel,
      status,
      verificationBadge,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // By default for public feed, show Verified, Under Review, and Pending (exclude Rejected unless requested)
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'Rejected' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (verificationBadge && verificationBadge !== 'All') {
      query.verificationBadge = verificationBadge;
    }

    if (riskLevel && riskLevel !== 'All') {
      if (riskLevel === 'Low') query.riskScore = { $gte: 0, $lte: 25 };
      else if (riskLevel === 'Moderate') query.riskScore = { $gt: 25, $lte: 50 };
      else if (riskLevel === 'High') query.riskScore = { $gt: 50, $lte: 75 };
      else if (riskLevel === 'Critical') query.riskScore = { $gt: 75, $lte: 100 };
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { domain: { $regex: term, $options: 'i' } },
        { websiteUrl: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ];
    }

    // Sort options
    let sortObj = { createdAt: -1 };
    if (sort === 'mostVoted') {
      sortObj = { 'votesCount.experienced': -1, createdAt: -1 };
    } else if (sort === 'highestRisk') {
      sortObj = { riskScore: -1, createdAt: -1 };
    } else if (sort === 'verified') {
      sortObj = { status: 1, createdAt: -1 }; // Prioritize Verified status
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('userId', 'name reputation badges')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: reports.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      reports
    });
  } catch (error) {
    console.error('getReports error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching reports'
    });
  }
};

// @desc    Fast search by domain, report ID, or keywords
// @route   GET /api/reports/search
// @access  Public
exports.searchReports = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, reports: [] });
    }

    const term = q.trim();
    const query = {
      status: { $ne: 'Rejected' },
      $or: [
        { domain: { $regex: term, $options: 'i' } },
        { websiteUrl: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ]
    };

    // If query is a valid 24-char ObjectId, include exact id match
    if (term.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: term });
    }

    const reports = await Report.find(query)
      .select('domain websiteUrl category riskScore status verificationBadge votesCount createdAt')
      .limit(10);

    return res.status(200).json({
      success: true,
      reports
    });
  } catch (error) {
    console.error('searchReports error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during report search'
    });
  }
};

// @desc    Get single report by ID with user vote status and similar reports
// @route   GET /api/reports/:id
// @access  Public (optionalAuth)
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('userId', 'name reputation badges');
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    let userVote = null;
    if (req.user) {
      const existingVote = await Vote.findOne({
        userId: req.user._id,
        reportId: report._id
      });
      if (existingVote) {
        userVote = existingVote.voteType;
      }
    }

    // Similar reports in the same category or domain
    const similarReports = await Report.find({
      _id: { $ne: report._id },
      status: { $ne: 'Rejected' },
      $or: [
        { domain: report.domain },
        { category: report.category }
      ]
    })
      .select('domain category riskScore votesCount verificationBadge createdAt')
      .limit(3);

    return res.status(200).json({
      success: true,
      report,
      userVote,
      similarReports
    });
  } catch (error) {
    console.error('getReportById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching report details'
    });
  }
};

// @desc    Create a new report
// @route   POST /api/reports
// @access  Public (Authenticated or Anonymous)
exports.createReport = async (req, res) => {
  try {
    const {
      websiteUrl,
      category,
      description,
      initialPrice,
      finalPrice,
      additionalFee,
      subscriptionAmount,
      cancellationDifficulty,
      isAnonymous,
      confirmationAccepted
    } = req.body;

    if (!websiteUrl || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Website URL, Category, and Description'
      });
    }

    // Check confirmation checkbox
    if (confirmationAccepted !== 'true' && confirmationAccepted !== true) {
      return res.status(400).json({
        success: false,
        message: 'You must confirm that this report is based on your experience or publicly accessible information'
      });
    }

    const domain = extractDomain(websiteUrl);

    // Screenshot URL if uploaded
    let screenshotUrl = '';
    if (req.file) {
      screenshotUrl = `/uploads/${req.file.filename}`;
    }

    // Run automated assistive assessment to determine initial risk score and patterns
    const aiAnalysis = await analyzeScreenshotOrUrl({
      url: websiteUrl,
      filePath: req.file ? req.file.path : null,
      originalFilename: req.file ? req.file.originalname : ''
    });

    const isAnon = isAnonymous === 'true' || isAnonymous === true || !req.user;

    const report = await Report.create({
      userId: req.user ? req.user._id : null,
      isAnonymous: isAnon,
      websiteUrl,
      domain,
      category,
      description,
      screenshotUrl,
      riskScore: aiAnalysis.riskScore || 65,
      status: 'Pending',
      verificationBadge: 'Community Reported',
      evidence: {
        initialPrice: initialPrice ? Number(initialPrice) : null,
        finalPrice: finalPrice ? Number(finalPrice) : null,
        additionalFee: additionalFee ? Number(additionalFee) : null,
        subscriptionAmount: subscriptionAmount ? Number(subscriptionAmount) : null,
        cancellationDifficulty: cancellationDifficulty || null
      },
      detectedPatterns: aiAnalysis.patterns || []
    });

    // Reward user reputation if logged in
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { reputation: 15 },
        $addToSet: { badges: 'First Report' }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Your report is now queued for community validation.',
      reportId: report._id,
      report
    });
  } catch (error) {
    console.error('createReport error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting report',
      error: error.message
    });
  }
};

// @desc    Update report (Author or Admin)
// @route   PUT /api/reports/:id
// @access  Private
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const isOwner = req.user && report.userId && report.userId.toString() === req.user._id.toString();
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this report' });
    }

    const { category, description, initialPrice, finalPrice, additionalFee } = req.body;
    if (category) report.category = category;
    if (description) report.description = description;
    if (initialPrice !== undefined) report.evidence.initialPrice = initialPrice ? Number(initialPrice) : null;
    if (finalPrice !== undefined) report.evidence.finalPrice = finalPrice ? Number(finalPrice) : null;
    if (additionalFee !== undefined) report.evidence.additionalFee = additionalFee ? Number(additionalFee) : null;

    await report.save();

    return res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('updateReport error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating report' });
  }
};

// @desc    Delete report (Author or Admin)
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const isOwner = req.user && report.userId && report.userId.toString() === req.user._id.toString();
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this report' });
    }

    await Vote.deleteMany({ reportId: report._id });
    await Comment.deleteMany({ reportId: report._id });
    await report.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Report removed successfully'
    });
  } catch (error) {
    console.error('deleteReport error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting report' });
  }
};

// @desc    Vote on a report (Abuse-prevented toggle: experienced / disagree)
// @route   POST /api/reports/:id/vote
// @access  Private
exports.voteReport = async (req, res) => {
  try {
    const { voteType } = req.body; // 'experienced' or 'disagree'
    if (!voteType || !['experienced', 'disagree'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type. Must be "experienced" or "disagree"'
      });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const existingVote = await Vote.findOne({
      userId: req.user._id,
      reportId: report._id
    });

    let currentVoteStatus = null;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // User clicked the same vote -> remove vote (toggle off)
        await existingVote.deleteOne();
        if (voteType === 'experienced') {
          report.votesCount.experienced = Math.max(0, report.votesCount.experienced - 1);
        } else {
          report.votesCount.disagree = Math.max(0, report.votesCount.disagree - 1);
        }
        currentVoteStatus = null;
      } else {
        // User switched their vote
        const oldType = existingVote.voteType;
        existingVote.voteType = voteType;
        await existingVote.save();

        if (oldType === 'experienced') {
          report.votesCount.experienced = Math.max(0, report.votesCount.experienced - 1);
          report.votesCount.disagree += 1;
        } else {
          report.votesCount.disagree = Math.max(0, report.votesCount.disagree - 1);
          report.votesCount.experienced += 1;
        }
        currentVoteStatus = voteType;
      }
    } else {
      // Brand new vote
      await Vote.create({
        userId: req.user._id,
        reportId: report._id,
        voteType
      });

      if (voteType === 'experienced') {
        report.votesCount.experienced += 1;
      } else {
        report.votesCount.disagree += 1;
      }
      currentVoteStatus = voteType;

      // Award voter a small reputation token for participating
      await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: 2 } });
    }

    // Auto-escalate status if heavily confirmed by community
    if (report.votesCount.experienced >= 5 && report.status === 'Pending') {
      report.status = 'Under Review';
    }

    await report.save();

    return res.status(200).json({
      success: true,
      message: currentVoteStatus ? `Voted "${voteType}" successfully` : 'Vote removed',
      votesCount: report.votesCount,
      userVote: currentVoteStatus
    });
  } catch (error) {
    console.error('voteReport error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing vote' });
  }
};

// @desc    Get comments for a report
// @route   GET /api/reports/:id/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ reportId: req.params.id })
      .populate('userId', 'name reputation badges profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error('getComments error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching comments' });
  }
};

// @desc    Add comment to a report
// @route   POST /api/reports/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be blank'
      });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const newComment = await Comment.create({
      userId: req.user._id,
      reportId: report._id,
      comment: comment.trim()
    });

    report.commentsCount += 1;
    await report.save();

    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name reputation badges profileImage');

    // Reward commenter with reputation
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reputation: 3 },
      $addToSet: { badges: 'Community Guardian' }
    });

    return res.status(201).json({
      success: true,
      message: 'Comment posted',
      comment: populatedComment
    });
  } catch (error) {
    console.error('addComment error:', error);
    return res.status(500).json({ success: false, message: 'Server error posting comment' });
  }
};
