const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function deletePoll(pollId) {
  const poll = await pollRepository.findPollById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.status = 404;
    throw error;
  }

  await pollRepository.deletePollById(pollId);
  return { deleted: true };
}

module.exports = {
  deletePoll,
};
