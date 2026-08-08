const express = require('express');
const router = express.Router();
const  { protect } = require('../middleware/authMiddleware')
const { saveAppReviews, getAppReview } = require('../controllers/appReviewController')

router.patch("/me", protect, saveAppReviews);
router.get('/me', protect, getAppReview)

module.exports = router;