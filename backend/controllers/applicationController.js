const Application = require('../models/Application');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// @desc    Candidate applies to a job
// @route   POST /api/jobs/:jobId/apply
// @access  Private (Candidate)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job posting is closed for applications' });
    }

    // Check for duplicate application
    const existingApp = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });

    if (existingApp) {
      return res.status(409).json({ message: 'You have already applied to this job listing' });
    }

    // Determine resume URL (Uploaded file takes priority, fallback to candidate profile resume)
    let resumeUrl = '';
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
    } else {
      const candidateProfile = await CandidateProfile.findOne({ user: req.user._id });
      if (candidateProfile && candidateProfile.resumeUrl) {
        resumeUrl = candidateProfile.resumeUrl;
      }
    }

    if (!resumeUrl) {
      return res.status(400).json({ message: 'Please attach a resume file or upload one in your candidate profile first' });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'applied',
      statusHistory: [{
        status: 'applied',
        changedAt: new Date(),
        changedBy: req.user._id
      }]
    });

    const populatedApp = await Application.findById(application._id)
      .populate('job')
      .populate('candidate', 'name email');

    res.status(201).json(populatedApp);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already applied to this job listing' });
    }
    console.error('ApplyToJob Error:', error);
    res.status(500).json({ message: error.message || 'Server error submitting application' });
  }
};

// @desc    Get all applicants for a job (for Recruiter Kanban view)
// @route   GET /api/jobs/:jobId/applications
// @access  Private (Recruiter - own job or Admin)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email createdAt')
      .populate('statusHistory.changedBy', 'name email')
      .sort({ createdAt: -1 });

    // Fetch candidate profiles to attach skills, headline, experience & match score
    const applicantsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        const candidateProfile = await CandidateProfile.findOne({ user: app.candidate._id });
        
        if (candidateProfile) {
          appObj.candidateProfile = {
            headline: candidateProfile.headline,
            skills: candidateProfile.skills,
            experienceYears: candidateProfile.experienceYears,
            location: candidateProfile.location,
            education: candidateProfile.education,
            workHistory: candidateProfile.workHistory
          };

          const matchInfo = calculateSkillMatch(candidateProfile.skills, job.skillsRequired);
          appObj.matchPercentage = matchInfo.matchPercentage;
          appObj.matchedSkills = matchInfo.matchedSkills;
          appObj.missingSkills = matchInfo.missingSkills;
        } else {
          appObj.matchPercentage = 0;
          appObj.matchedSkills = [];
          appObj.missingSkills = job.skillsRequired || [];
        }

        return appObj;
      })
    );

    res.json({
      job: {
        _id: job._id,
        title: job.title,
        skillsRequired: job.skillsRequired,
        status: job.status
      },
      applications: applicantsWithProfiles
    });
  } catch (error) {
    console.error('GetJobApplications Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching applicants' });
  }
};

// @desc    Update application status (Kanban stage transition)
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter - own job or Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['applied', 'shortlisted', 'interview', 'offer', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${validStatuses.join(', ')}` });
    }

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = application.job;
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update candidate application status for this job' });
    }

    // Update status and append to history log
    application.status = status;
    application.statusHistory.push({
      status: status,
      changedAt: new Date(),
      changedBy: req.user._id
    });

    await application.save();

    const updatedApp = await Application.findById(application._id)
      .populate('candidate', 'name email')
      .populate('statusHistory.changedBy', 'name email');

    res.json(updatedApp);
  } catch (error) {
    console.error('UpdateApplicationStatus Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating application status' });
  }
};

module.exports = {
  applyToJob,
  getJobApplications,
  updateApplicationStatus
};
