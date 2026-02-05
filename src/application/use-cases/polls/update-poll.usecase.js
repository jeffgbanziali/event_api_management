const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function updatePoll(pollId, data) {
  const poll = await pollRepository.findPollById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.status = 404;
    throw error;
  }

  const updated = await pollRepository.updatePollById(pollId, {
    ...(data.title !== undefined && { title: data.title }),
  });
  return updated;
}

module.exports = {
  updatePoll,
};
