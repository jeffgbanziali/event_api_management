const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function deleteOption(optionId) {
  const option = await pollRepository.findOptionById(optionId);
  if (!option) {
    const error = new Error('Option not found');
    error.status = 404;
    throw error;
  }

  await pollRepository.deleteOptionById(optionId);
  return { deleted: true };
}

module.exports = {
  deleteOption,
};
