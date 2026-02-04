const groupRepository = require('../../../infrastructure/mongoose/repositories/group.repository');
const groupMembershipRepository = require('../../../infrastructure/mongoose/repositories/group-membership.repository');

async function createGroup(input, currentUserId) {
  const group = await groupRepository.create({
    name: input.name,
    description: input.description,
    icon: input.icon,
    coverPhotoUrl: input.coverPhotoUrl,
    type: input.type,
    allowMembersToPost: input.allowMembersToPost,
    allowMembersToCreateEvents: input.allowMembersToCreateEvents,
    createdBy: currentUserId,
  });

  // Le créateur devient automatiquement admin du groupe
  await groupMembershipRepository.addMember({
    groupId: group.id,
    userId: currentUserId,
    role: 'admin',
  });

  return group;
}

module.exports = {
  createGroup,
};

