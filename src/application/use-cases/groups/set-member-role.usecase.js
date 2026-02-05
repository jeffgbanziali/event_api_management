const groupMembershipRepository = require('../../../infrastructure/mongoose/repositories/group-membership.repository');

async function setMemberRole(groupId, userId, role) {
  const membership = await groupMembershipRepository.findMembership(groupId, userId);
  if (!membership) {
    const error = new Error('User is not a member of this group');
    error.status = 404;
    throw error;
  }
  const updated = await groupMembershipRepository.updateRole(groupId, userId, role);
  return updated;
}

module.exports = {
  setMemberRole,
};
