const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Company = require('../models/Company');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hirenet_super_secret_jwt_key_2026_safe_dev', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName, companyWebsite } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const assignedRole = ['candidate', 'recruiter', 'admin'].includes(role) ? role : 'candidate';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      isVerified: assignedRole === 'recruiter' ? false : true // Recruiters require admin verification
    });

    // Auto-create CandidateProfile or Company shell
    if (assignedRole === 'candidate') {
      await CandidateProfile.create({
        user: user._id,
        headline: '',
        skills: [],
        experienceYears: 0,
        location: ''
      });
    } else if (assignedRole === 'recruiter') {
      await Company.create({
        recruiter: user._id,
        name: companyName || `${name}'s Organization`,
        website: companyWebsite || '',
        description: '',
        isVerified: false
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let profileData = null;

    if (user.role === 'candidate') {
      profileData = await CandidateProfile.findOne({ user: user._id }).populate('bookmarkedJobs');
    } else if (user.role === 'recruiter') {
      profileData = await Company.findOne({ recruiter: user._id });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      profile: profileData
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching user details' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
