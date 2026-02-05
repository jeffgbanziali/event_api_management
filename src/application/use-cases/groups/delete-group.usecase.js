const groupRepository = require('../../../infrastructure/mongoose/repositories/group.repository');

async function deleteGroup(groupId) {
  const group = await groupRepository.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.status = 404;
    throw error;
  }
  await groupRepository.deleteById(groupId);
  return { deleted: true };
}

module.exports = {
  deleteGroup,
};
