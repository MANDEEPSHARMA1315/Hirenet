const express = require('express');
const router = express.Router();
const {
  createOrUpdateCompany,
  getCompanyById,
  getMyCompany
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', protect, authorize('recruiter'), getMyCompany);
router.post('/', protect, authorize('recruiter'), upload.single('logo'), createOrUpdateCompany);
router.put('/', protect, authorize('recruiter'), upload.single('logo'), createOrUpdateCompany);
router.get('/:id', getCompanyById);

module.exports = router;
