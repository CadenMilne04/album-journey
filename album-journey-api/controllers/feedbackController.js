const feedbackService = require('../services/feedbackService');

const submitFeedback = async (req, res) => {
  try {
    const { feedback, timestamp } = req.body;
    
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Feedback text is required'
      });
    }

    const result = await feedbackService.submitFeedback({
      feedback: feedback.trim(),
      timestamp: timestamp || new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to submit feedback'
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.getAllFeedback();
    res.json({
      feedback: feedback,
      count: feedback.length
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch feedback'
    });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback
};
