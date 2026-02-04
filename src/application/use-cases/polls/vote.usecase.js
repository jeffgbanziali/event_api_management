const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

async function vote(input, currentUserId) {
  const option = await pollRepository.findOptionById(input.optionId);
  if (!option) {
    const error = new Error('Option not found');
    error.status = 404;
    throw error;
  }

  const question = await pollRepository.findQuestionById(option.question);
  if (!question) {
    const error = new Error('Question not found');
    error.status = 404;
    throw error;
  }

  const poll = await pollRepository.findPollById(question.poll);
  if (!poll) {
    const error = new Error('Poll not found');
    error.status = 404;
    throw error;
  }

  // Vérifier que l'utilisateur est participant de l'événement du sondage
  const participant = await eventParticipantRepository.findParticipant(poll.event, currentUserId);
  if (!participant) {
    const error = new Error('Only event participants can vote on this poll');
    error.status = 403;
    throw error;
  }

  const response = await pollRepository.createResponse({
    pollId: poll.id,
    questionId: question.id,
    optionId: option.id,
    participantId: currentUserId,
  });

  return response;
}

module.exports = {
  vote,
};

