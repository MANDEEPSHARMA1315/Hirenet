const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// @desc    Get logged in candidate profile
// @route   GET /api/candidates/me
// @access  Private (Candidate)
const getCandidateProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id })
      .populate({
        path: 'bookmarkedJobs',
        populate: { path: 'company', select: 'name logoUrl location' }
      });

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.user._id,
        skills: [],
        education: [],
        workHistory: [],
        bookmarkedJobs: []
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('GetCandidateProfile Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching candidate profile' });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/me
// @access  Private (Candidate)
const updateCandidateProfile = async (req, res) => {
  try {
    const { headline, skills, experienceYears, location, education, workHistory } = req.body;

    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (skills !== undefined) {
      profile.skills = Array.isArray(skills) 
        ? skills.map(s => s.trim().toLowerCase()) 
        : skills.split(',').map(s => s.trim().toLowerCase());
    }
    if (experienceYears !== undefined) profile.experienceYears = Number(experienceYears);
    if (location !== undefined) profile.location = location;
    if (education !== undefined) profile.education = education;
    if (workHistory !== undefined) profile.workHistory = workHistory;

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error('UpdateCandidateProfile Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

// @desc    Upload candidate resume
// @route   POST /api/candidates/me/resume
// @access  Private (Candidate)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    let profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    profile.resumeUrl = resumeUrl;
    await profile.save();

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl: profile.resumeUrl
    });
  } catch (error) {
    console.error('UploadResume Error:', error);
    res.status(500).json({ message: error.message || 'Server error uploading resume' });
  }
};

// @desc    Bookmark or unbookmark a job
// @route   POST /api/candidates/me/bookmarks/:jobId
// @access  Private (Candidate)
const toggleBookmarkJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await CandidateProfile.create({ user: req.user._id });
    }

    const isBookmarked = profile.bookmarkedJobs.some(
      id => id.toString() === jobId
    );

    if (isBookmarked) {
      profile.bookmarkedJobs = profile.bookmarkedJobs.filter(
        id => id.toString() !== jobId
      );
    } else {
      profile.bookmarkedJobs.push(jobId);
    }

    await profile.save();

    res.json({
      isBookmarked: !isBookmarked,
      bookmarkedJobs: profile.bookmarkedJobs
    });
  } catch (error) {
    console.error('ToggleBookmark Error:', error);
    res.status(500).json({ message: error.message || 'Server error bookmarking job' });
  }
};

// @desc    Get all applications submitted by candidate
// @route   GET /api/candidates/me/applications
// @access  Private (Candidate)
const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logoUrl location' }
      })
      .sort({ createdAt: -1 });

    const candidateProfile = await CandidateProfile.findOne({ user: req.user._id });
    const candidateSkills = candidateProfile ? candidateProfile.skills : [];

    // Calculate skill match score for each application
    const applicationsWithMatch = applications.map(app => {
      const appObj = app.toObject();
      if (app.job) {
        const matchInfo = calculateSkillMatch(candidateSkills, app.job.skillsRequired);
        appObj.matchPercentage = matchInfo.matchPercentage;
        appObj.matchedSkills = matchInfo.matchedSkills;
        appObj.missingSkills = matchInfo.missingSkills;
      }
      return appObj;
    });

    res.json(applicationsWithMatch);
  } catch (error) {
    console.error('GetCandidateApplications Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching applications' });
  }
};

module.exports = {
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
  toggleBookmarkJob,
  getCandidateApplications
};
