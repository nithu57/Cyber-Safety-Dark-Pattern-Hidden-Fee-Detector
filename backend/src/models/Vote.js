const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
    index: true
  },
  voteType: {
    type: String,
    enum: ['experienced', 'disagree'],
    required: true
  },
  ipAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

VoteSchema.index({ userId: 1, reportId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
