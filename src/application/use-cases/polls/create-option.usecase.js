const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function createOption(input) {
  const question = await pollRepository.findQuestionById(input.questionId);
  if (!question) {
    const error = new Error('Question not found');
    error.status = 404;
    throw error;
  }

  const option = await pollRepository.createOption({
    questionId: input.questionId,
    text: input.text,
    order: input.order,
  });

  return option;
}

module.exports = {
  createOption,
};

