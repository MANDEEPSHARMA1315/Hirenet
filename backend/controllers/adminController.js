const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');

// @desc    Get all recruiters/companies pending verification
// @route   GET /api/admin/recruiters/pending
// @access  Private (Admin)
const getPendingRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select('-password');
    const companies = await Company.find().populate('recruiter', 'name email isVerified createdAt');

    res.json({
      recruiters,
      companies
    });
  } catch (error) {
    console.error('GetPendingRecruiters Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching verification queue' });
  }
};

// @desc    Verify or revoke recruiter/company account
// @route   PATCH /api/admin/recruiters/:id/verify
// @access  Private (Admin)
const verifyRecruiterCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = isVerified !== undefined ? isVerified : true;
    await user.save();

    // Also verify matching company
    const company = await Company.findOne({ recruiter: user._id });
    if (company) {
      company.isVerified = user.isVerified;
      await company.save();
    }

    res.json({
      message: `Recruiter account ${user.isVerified ? 'verified' : 'unverified'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      company
    });
  } catch (error) {
    console.error('VerifyRecruiterCompany Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating verification status' });
  }
};

// @desc    Get overall platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getPlatformStats = async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalVerifiedRecruiters = await User.countDocuments({ role: 'recruiter', isVerified: true });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();

    // Pipeline status breakdown
    const applicationStatusStats = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      users: {
        totalCandidates,
        totalRecruiters,
        verifiedRecruiters: totalVerifiedRecruiters,
        pendingRecruiters: totalRecruiters - totalVerifiedRecruiters
      },
      companies: totalCompanies,
      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: totalJobs - activeJobs
      },
      applications: {
        total: totalApplications,
        byStatus: applicationStatusStats
      }
    });
  } catch (error) {
    console.error('GetPlatformStats Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching stats' });
  }
};

module.exports = {
  getPendingRecruiters,
  verifyRecruiterCompany,
  getPlatformStats
};
