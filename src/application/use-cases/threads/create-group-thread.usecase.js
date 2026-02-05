const groupRepository = require('../../../infrastructure/mongoose/repositories/group.repository');
const threadRepository = require('../../../infrastructure/mongoose/repositories/thread.repository');

async function createGroupThread(input, currentUserId) {
  const group = await groupRepository.findById(input.groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.status = 404;
    throw error;
  }

  const thread = await threadRepository.createForGroup({
    groupId: input.groupId,
    title: input.title,
    createdBy: currentUserId,
  });

  return thread;
}

module.exports = {
  createGroupThread,
};
