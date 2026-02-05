const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function getPollResults(pollId) {
  const poll = await pollRepository.findPollById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.status = 404;
    throw error;
  }

  const questions = await pollRepository.listQuestionsForPoll(pollId);
  const resultsByOption = await pollRepository.aggregateResults(pollId);
  const countByOptionId = Object.fromEntries(
    resultsByOption.map((r) => [r._id.toString(), r.count])
  );

  const questionsWithResults = await Promise.all(
    questions.map(async (q) => {
      const options = await pollRepository.listOptionsForQuestion(q.id);
      return {
        id: q.id,
        text: q.text,
        order: q.order,
        options: options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          order: opt.order,
          count: countByOptionId[opt.id.toString()] ?? 0,
        })),
      };
    })
  );

  return {
    pollId: poll.id,
    title: poll.title,
    questions: questionsWithResults,
  };
}

module.exports = {
  getPollResults,
};
