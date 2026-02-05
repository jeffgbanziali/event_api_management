const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function updateQuestion(questionId, data) {
  const question = await pollRepository.findQuestionById(questionId);
  if (!question) {
    const error = new Error('Question not found');
    error.status = 404;
    throw error;
  }

  const updated = await pollRepository.updateQuestionById(questionId, {
    ...(data.text !== undefined && { text: data.text }),
    ...(data.order !== undefined && { order: data.order }),
  });
  return updated;
}

module.exports = {
  updateQuestion,
};
