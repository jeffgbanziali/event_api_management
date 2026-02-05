// Contrôleur groupes : CRUD, membres, promotion/rétrogradation admin (visibilité public/private/secret)
const { validate } = require('../../../validation/middlewares/validate.middleware');
const {
  createGroupSchema,
  updateGroupSchema,
  addGroupMemberSchema,
  promoteAdminSchema,
} = require('../../../validation/schemas/group.validation');
const { createGroup } = require('../../../application/use-cases/groups/create-group.usecase');
const { addGroupMember } = require('../../../application/use-cases/groups/add-group-member.usecase');
const { updateGroup } = require('../../../application/use-cases/groups/update-group.usecase');
const { deleteGroup } = require('../../../application/use-cases/groups/delete-group.usecase');
const { setMemberRole } = require('../../../application/use-cases/groups/set-member-role.usecase');
const { removeMember } = require('../../../application/use-cases/groups/remove-member.usecase');
const groupRepository = require('../../../infrastructure/mongoose/repositories/group.repository');
const groupMembershipRepository = require('../../../infrastructure/mongoose/repositories/group-membership.repository');

const validateCreateGroup = validate(createGroupSchema);
const validateUpdateGroup = validate(updateGroupSchema);
const validateAddMember = validate(addGroupMemberSchema);
const validatePromoteAdmin = validate(promoteAdminSchema);

async function create(req, res, next) {
  try {
    const group = await createGroup(req.body, req.user.id);
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const groups = await groupRepository.listVisibleForUser(req.user.id);
    res.json(groups);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const group = await groupRepository.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const membership = await groupMembershipRepository.findMembership(req.params.groupId, req.user.id);
    if (group.type === 'secret' && !membership) return res.status(404).json({ error: 'Group not found' });
    if (group.type === 'private' && !membership) return res.status(403).json({ error: 'Forbidden: join to see this group' });
    res.json(group);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const group = await updateGroup(req.params.groupId, req.body);
    res.json(group);
  } catch (err) {
    next(err);
  }
}

async function deleteGroupHandler(req, res, next) {
  try {
    await deleteGroup(req.params.groupId);
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

async function addMember(req, res, next) {
  try {
    const membership = await addGroupMember(
      {
        groupId: req.params.groupId,
        userId: req.body.userId,
        role: req.body.role,
      },
      req.user.id
    );
    res.status(201).json(membership);
  } catch (err) {
    next(err);
  }
}

async function listMembers(req, res, next) {
  try {
    const group = await groupRepository.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const membership = await groupMembershipRepository.findMembership(req.params.groupId, req.user.id);
    if (group.type !== 'public' && !membership) return res.status(403).json({ error: 'Forbidden' });
    const members = await groupMembershipRepository.listMembers(req.params.groupId);
    res.json(members);
  } catch (err) {
    next(err);
  }
}

async function promoteAdmin(req, res, next) {
  try {
    const membership = await setMemberRole(req.params.groupId, req.body.userId, 'admin');
    res.json(membership);
  } catch (err) {
    next(err);
  }
}

async function demoteAdmin(req, res, next) {
  try {
    const membership = await setMemberRole(req.params.groupId, req.params.userId, 'member');
    res.json(membership);
  } catch (err) {
    next(err);
  }
}

async function removeMemberHandler(req, res, next) {
  try {
    await removeMember(req.params.groupId, req.params.userId);
    res.status(200).json({ removed: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateGroup,
  validateUpdateGroup,
  validateAddMember,
  validatePromoteAdmin,
  create,
  list,
  getById,
  update,
  deleteGroupHandler,
  addMember,
  listMembers,
  promoteAdmin,
  demoteAdmin,
  removeMemberHandler,
};
