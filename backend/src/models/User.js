const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password hash']
  },
  profileImage: {
    type: String,
    default: ''
  },
  reputation: {
    type: Number,
    default: 10
  },
  badges: [{
    type: String,
    enum: [
      'First Report',
      'Evidence Expert',
      'Community Guardian',
      'Verified Contributor',
      'Top Hunter',
      'Dark Pattern Analyst'
    ]
  }],
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
