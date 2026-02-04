const groupRepository = require('../../../infrastructure/mongoose/repositories/group.repository');
const groupMembershipRepository = require('../../../infrastructure/mongoose/repositories/group-membership.repository');

async function addGroupMember(input, currentUserId) {
  const group = await groupRepository.findById(input.groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.status = 404;
    throw error;
  }

  // La vérification que currentUserId est admin est faite dans le middleware d'autorisation.

  const existing = await groupMembershipRepository.findMembership(input.groupId, input.userId);
  if (existing) {
    const error = new Error('User is already a member of this group');
    error.status = 409;
    throw error;
  }

  const membership = await groupMembershipRepository.addMember({
    groupId: input.groupId,
    userId: input.userId,
    role: input.role || 'member',
  });

  return membership;
}

module.exports = {
  addGroupMember,
};

