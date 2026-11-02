const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Candidate applies to a job
router.post('/jobs/:jobId/apply', protect, authorize('candidate'), upload.single('resume'), applyToJob);

// Recruiter gets applicants for a specific job
router.get('/jobs/:jobId/applications', protect, authorize('recruiter', 'admin'), getJobApplications);

// Recruiter updates application status in Kanban pipeline
router.patch('/applications/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
