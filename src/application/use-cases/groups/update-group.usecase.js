const groupRepository = require('../../../infrastructure/mongoose/repositories/group.repository');

async function updateGroup(groupId, data) {
  const group = await groupRepository.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.status = 404;
    throw error;
  }
  const updated = await groupRepository.updateById(groupId, {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.icon !== undefined && { icon: data.icon }),
    ...(data.coverPhotoUrl !== undefined && { coverPhotoUrl: data.coverPhotoUrl }),
    ...(data.type !== undefined && { type: data.type }),
    ...(data.allowMembersToPost !== undefined && { allowMembersToPost: data.allowMembersToPost }),
    ...(data.allowMembersToCreateEvents !== undefined && { allowMembersToCreateEvents: data.allowMembersToCreateEvents }),
  });
  return updated;
}

module.exports = {
  updateGroup,
};
