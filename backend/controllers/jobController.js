const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// @desc    Get all jobs with search & multi-field filters
// @route   GET /api/jobs
// @access  Public (Optional auth for skill match score)
const getJobs = async (req, res) => {
  try {
    const {
      search,
      skills,
      location,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      status = 'open',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (skills) {
      const skillsArray = Array.isArray(skills)
        ? skills.map(s => s.trim().toLowerCase())
        : skills.split(',').map(s => s.trim().toLowerCase());

      query.skillsRequired = { $in: skillsArray };
    }

    if (minSalary || maxSalary) {
      query.salaryMax = {};
      if (minSalary) query.salaryMax.$gte = Number(minSalary);
      if (maxSalary) query.salaryMin = { $lte: Number(maxSalary) };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const count = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logoUrl location isVerified')
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // If request has authenticated candidate, attach skill match score to each job
    let candidateSkills = [];
    if (req.user && req.user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ user: req.user._id });
      if (profile) {
        candidateSkills = profile.skills || [];
      }
    }

    const jobsWithMatch = jobs.map(job => {
      const jobObj = job.toObject();
      if (candidateSkills.length > 0) {
        const matchInfo = calculateSkillMatch(candidateSkills, job.skillsRequired);
        jobObj.matchPercentage = matchInfo.matchPercentage;
        jobObj.matchedSkills = matchInfo.matchedSkills;
        jobObj.missingSkills = matchInfo.missingSkills;
      }
      return jobObj;
    });

    res.json({
      jobs: jobsWithMatch,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
      totalJobs: count
    });
  } catch (error) {
    console.error('GetJobs Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching jobs' });
  }
};

// @desc    Get single job by ID & increment view count
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logoUrl location website description isVerified')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Increment view count
    job.viewCount = (job.viewCount || 0) + 1;
    await job.save();

    const jobObj = job.toObject();

    // Attach total applications count
    const totalApplications = await Application.countDocuments({ job: job._id });
    jobObj.totalApplications = totalApplications;

    // Attach candidate skill match score if candidate user is logged in
    if (req.user && req.user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ user: req.user._id });
      if (profile) {
        const matchInfo = calculateSkillMatch(profile.skills, job.skillsRequired);
        jobObj.matchPercentage = matchInfo.matchPercentage;
        jobObj.matchedSkills = matchInfo.matchedSkills;
        jobObj.missingSkills = matchInfo.missingSkills;
      }
    }

    res.json(jobObj);
  } catch (error) {
    console.error('GetJobById Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching job details' });
  }
};

// @desc    Create job posting
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      skillsRequired,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax
    } = req.body;

    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      return res.status(400).json({ message: 'Please create a company profile first before posting jobs' });
    }

    const skillsArray = Array.isArray(skillsRequired)
      ? skillsRequired.map(s => s.trim().toLowerCase())
      : (typeof skillsRequired === 'string' ? skillsRequired.split(',').map(s => s.trim().toLowerCase()) : []);

    const job = await Job.create({
      company: company._id,
      postedBy: req.user._id,
      title,
      description,
      skillsRequired: skillsArray,
      location,
      jobType: jobType || 'full-time',
      experienceLevel: experienceLevel || 'mid',
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      status: 'open',
      viewCount: 0
    });

    const populatedJob = await Job.findById(job._id).populate('company');
    res.status(201).json(populatedJob);
  } catch (error) {
    console.error('CreateJob Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating job post' });
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter - own jobs)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this job posting' });
    }

    const {
      title,
      description,
      skillsRequired,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      status
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (skillsRequired !== undefined) {
      job.skillsRequired = Array.isArray(skillsRequired)
        ? skillsRequired.map(s => s.trim().toLowerCase())
        : (typeof skillsRequired === 'string' ? skillsRequired.split(',').map(s => s.trim().toLowerCase()) : []);
    }
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (salaryMin !== undefined) job.salaryMin = Number(salaryMin);
    if (salaryMax !== undefined) job.salaryMax = Number(salaryMax);
    if (status) job.status = status;

    await job.save();
    const updatedJob = await Job.findById(job._id).populate('company');

    res.json(updatedJob);
  } catch (error) {
    console.error('UpdateJob Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating job' });
  }
};

// @desc    Delete or soft-close job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter - own jobs)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job posting' });
    }

    // Soft delete by switching status to 'closed'
    job.status = 'closed';
    await job.save();

    res.json({ message: 'Job posting closed successfully', id: job._id });
  } catch (error) {
    console.error('DeleteJob Error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting job' });
  }
};

// @desc    Get recruiter's own posted jobs with application & view stats
// @route   GET /api/jobs/recruiter/mine
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const jobObj = job.toObject();
        const applicationCount = await Application.countDocuments({ job: job._id });
        jobObj.applicantCount = applicationCount;
        jobObj.conversionRate = job.viewCount > 0 ? ((applicationCount / job.viewCount) * 100).toFixed(1) : '0.0';
        return jobObj;
      })
    );

    res.json(jobsWithStats);
  } catch (error) {
    console.error('GetRecruiterJobs Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching recruiter postings' });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
};
