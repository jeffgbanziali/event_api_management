const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function updateOption(optionId, data) {
  const option = await pollRepository.findOptionById(optionId);
  if (!option) {
    const error = new Error('Option not found');
    error.status = 404;
    throw error;
  }

  const updated = await pollRepository.updateOptionById(optionId, {
    ...(data.text !== undefined && { text: data.text }),
    ...(data.order !== undefined && { order: data.order }),
  });
  return updated;
}

module.exports = {
  updateOption,
};
