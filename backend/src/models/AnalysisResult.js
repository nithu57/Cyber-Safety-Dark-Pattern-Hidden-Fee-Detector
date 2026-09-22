const mongoose = require('mongoose');

const AnalysisResultSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    default: null
  },
  url: {
    type: String,
    default: ''
  },
  domain: {
    type: String,
    default: ''
  },
  screenshotUrl: {
    type: String,
    default: ''
  },
  detectedPatterns: [{
    type: { type: String, required: true },
    confidence: { type: Number, required: true },
    evidence: { type: String, required: true },
    explanation: { type: String, required: true },
    recommendedAction: { type: String, default: '' }
  }],
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  disclaimer: {
    type: String,
    default: 'DarkGuard automated analysis is an assistive assessment tool, not a definitive legal determination.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalysisResult', AnalysisResultSchema);
