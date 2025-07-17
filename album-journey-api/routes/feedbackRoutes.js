const express = require('express');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

// POST /api/feedback
router.post('/', feedbackController.submitFeedback);

// GET /api/feedback (for admin use)
router.get('/', feedbackController.getAllFeedback);

module.exports = router;
