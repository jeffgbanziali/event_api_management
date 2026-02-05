const groupMembershipRepository = require('../../../infrastructure/mongoose/repositories/group-membership.repository');

async function removeMember(groupId, userId) {
  const membership = await groupMembershipRepository.findMembership(groupId, userId);
  if (!membership) {
    const error = new Error('User is not a member of this group');
    error.status = 404;
    throw error;
  }
  await groupMembershipRepository.removeMember(groupId, userId);
  return { removed: true };
}

module.exports = {
  removeMember,
};
