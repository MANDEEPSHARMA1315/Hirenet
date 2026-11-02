const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  headline: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  experienceYears: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: ''
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  workHistory: [{
    company: String,
    title: String,
    from: String,
    to: String,
    description: String
  }],
  bookmarkedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
}, {
  timestamps: true
});

candidateProfileSchema.index({ skills: 1 });

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
