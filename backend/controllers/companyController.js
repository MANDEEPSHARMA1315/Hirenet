const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Create or update recruiter's company profile
// @route   POST /api/companies
// @access  Private (Recruiter)
const createOrUpdateCompany = async (req, res) => {
  try {
    const { name, logoUrl, website, description } = req.body;

    let company = await Company.findOne({ recruiter: req.user._id });

    if (company) {
      if (name) company.name = name;
      if (logoUrl !== undefined) company.logoUrl = logoUrl;
      if (website !== undefined) company.website = website;
      if (description !== undefined) company.description = description;

      if (req.file) {
        company.logoUrl = `/uploads/logos/${req.file.filename}`;
      }

      await company.save();
      return res.json(company);
    } else {
      company = await Company.create({
        recruiter: req.user._id,
        name: name || 'Company Name',
        logoUrl: req.file ? `/uploads/logos/${req.file.filename}` : logoUrl || '',
        website: website || '',
        description: description || '',
        isVerified: false
      });
      return res.status(201).json(company);
    }
  } catch (error) {
    console.error('CreateOrUpdateCompany Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating company profile' });
  }
};

// @desc    Get company details by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('recruiter', 'name email');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const openJobs = await Job.find({ company: company._id, status: 'open' }).sort({ createdAt: -1 });

    res.json({
      company,
      openJobsCount: openJobs.length,
      jobs: openJobs
    });
  } catch (error) {
    console.error('GetCompanyById Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching company details' });
  }
};

// @desc    Get current recruiter's company profile
// @route   GET /api/companies/me
// @access  Private (Recruiter)
const getMyCompany = async (req, res) => {
  try {
    let company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      company = await Company.create({
        recruiter: req.user._id,
        name: `${req.user.name}'s Company`,
        isVerified: false
      });
    }
    res.json(company);
  } catch (error) {
    console.error('GetMyCompany Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching recruiter company' });
  }
};

module.exports = {
  createOrUpdateCompany,
  getCompanyById,
  getMyCompany
};
