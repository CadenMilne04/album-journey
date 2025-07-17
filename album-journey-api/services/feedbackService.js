const databaseService = require('./databaseService');

const submitFeedback = async (feedbackData) => {
  try {
    const result = await databaseService.saveFeedback(feedbackData);
    return result;
  } catch (error) {
    console.error('Error in feedback service:', error.message);
    throw error;
  }
};

const getAllFeedback = async () => {
  try {
    const feedback = await databaseService.getAllFeedback();
    return feedback;
  } catch (error) {
    console.error('Error fetching feedback:', error.message);
    throw error;
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback
};
