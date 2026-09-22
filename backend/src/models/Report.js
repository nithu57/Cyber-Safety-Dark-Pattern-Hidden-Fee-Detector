const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  websiteUrl: {
    type: String,
    required: [true, 'Website URL is required'],
    trim: true
  },
  domain: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Hidden Fee',
      'Subscription Trap',
      'Pre-checked Option',
      'Misleading Button',
      'Fake Urgency',
      'Difficult Cancellation',
      'Confirmshaming',
      'Bait & Switch',
      'Forced Registration',
      'Privacy Dark Pattern',
      'Other'
    ],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  screenshotUrl: {
    type: String,
    default: ''
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Verified', 'Rejected'],
    default: 'Pending',
    index: true
  },
  verificationBadge: {
    type: String,
    enum: ['AI Detected', 'Community Reported', 'Admin Verified'],
    default: 'Community Reported'
  },
  evidence: {
    initialPrice: { type: Number, default: null },
    finalPrice: { type: Number, default: null },
    additionalFee: { type: Number, default: null },
    subscriptionAmount: { type: Number, default: null },
    cancellationDifficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Hard', 'Near Impossible', null],
      default: null
    }
  },
  detectedPatterns: [{
    type: { type: String },
    confidence: { type: Number },
    evidence: { type: String },
    explanation: { type: String }
  }],
  votesCount: {
    experienced: { type: Number, default: 0 },
    disagree: { type: Number, default: 0 }
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  isDemo: {
    type: Boolean,
    default: false
  },
  flagCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

ReportSchema.index({ domain: 'text', description: 'text', websiteUrl: 'text' });

module.exports = mongoose.model('Report', ReportSchema);
