const express = require('express');
const router = express.Router();
const {
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
  toggleBookmarkJob,
  getCandidateApplications
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', protect, authorize('candidate'), getCandidateProfile);
router.put('/me', protect, authorize('candidate'), updateCandidateProfile);
router.post('/me/resume', protect, authorize('candidate'), upload.single('resume'), uploadResume);
router.post('/me/bookmarks/:jobId', protect, authorize('candidate'), toggleBookmarkJob);
router.delete('/me/bookmarks/:jobId', protect, authorize('candidate'), toggleBookmarkJob);
router.get('/me/applications', protect, authorize('candidate'), getCandidateApplications);

module.exports = router;
