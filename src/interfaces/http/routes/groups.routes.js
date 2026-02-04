const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const {
  createGroupSchema,
  addGroupMemberSchema,
} = require('../../../validation/schemas/group.validation');
const { createGroup } = require('../../../application/use-cases/groups/create-group.usecase');
const { addGroupMember } = require('../../../application/use-cases/groups/add-group-member.usecase');
const groupRepository = require('../../../infrastructure/mongoose/repositories/group.repository');
const groupMembershipRepository = require('../../../infrastructure/mongoose/repositories/group-membership.repository');
const { requireGroupAdmin } = require('../../../middlewares/authorization.middleware');

const router = express.Router();

// Créer un groupe
router.post('/', authMiddleware, validate(createGroupSchema), async (req, res, next) => {
  try {
    const group = await createGroup(req.body, req.user.id);
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
});

// Lister les groupes publics (simple pour le moment)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const groups = await groupRepository.listVisibleForUser(req.user.id);
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

// Détails d'un groupe
router.get('/:groupId', authMiddleware, async (req, res, next) => {
  try {
    const group = await groupRepository.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    return res.json(group);
  } catch (err) {
    return next(err);
  }
});

// Ajouter un membre (admin du groupe uniquement)
router.post(
  '/:groupId/members',
  authMiddleware,
  requireGroupAdmin,
  validate(addGroupMemberSchema),
  async (req, res, next) => {
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
);

// Lister les membres d'un groupe
router.get('/:groupId/members', authMiddleware, async (req, res, next) => {
  try {
    const members = await groupMembershipRepository.listMembers(req.params.groupId);
    res.json(members);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

