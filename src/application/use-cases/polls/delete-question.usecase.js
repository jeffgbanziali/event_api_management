const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function deleteQuestion(questionId) {
  const question = await pollRepository.findQuestionById(questionId);
  if (!question) {
    const error = new Error('Question not found');
    error.status = 404;
    throw error;
  }

  await pollRepository.deleteQuestionById(questionId);
  return { deleted: true };
}

module.exports = {
  deleteQuestion,
};
