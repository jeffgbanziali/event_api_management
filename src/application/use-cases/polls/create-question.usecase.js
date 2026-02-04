const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function createQuestion(input) {
  const poll = await pollRepository.findPollById(input.pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.status = 404;
    throw error;
  }

  const question = await pollRepository.createQuestion({
    pollId: input.pollId,
    text: input.text,
    order: input.order,
  });

  return question;
}

module.exports = {
  createQuestion,
};

