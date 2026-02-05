const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireGroupAdmin, requireGroupAdminOrSelf } = require('../../../middlewares/authorization.middleware');
const groupsController = require('../controllers/groups.controller');

const router = express.Router();

// CRUD groupe : création et liste (auth), détail, modification/suppression (admin uniquement)
router.post('/', authMiddleware, groupsController.validateCreateGroup, groupsController.create);
router.get('/', authMiddleware, groupsController.list);
router.get('/:groupId', authMiddleware, groupsController.getById);
router.patch('/:groupId', authMiddleware, requireGroupAdmin, groupsController.validateUpdateGroup, groupsController.update);
router.delete('/:groupId', authMiddleware, requireGroupAdmin, groupsController.deleteGroupHandler);

// Membres : ajout/liste/retrait (admin ou soi-même pour quitter)

router.post(
  '/:groupId/members',
  authMiddleware,
  requireGroupAdmin,
  groupsController.validateAddMember,
  groupsController.addMember
);
router.get('/:groupId/members', authMiddleware, groupsController.listMembers);
router.delete('/:groupId/members/:userId', authMiddleware, requireGroupAdminOrSelf, groupsController.removeMemberHandler);

router.post(
  '/:groupId/admins',
  authMiddleware,
  requireGroupAdmin,
  groupsController.validatePromoteAdmin,
  groupsController.promoteAdmin
);
router.delete('/:groupId/admins/:userId', authMiddleware, requireGroupAdmin, groupsController.demoteAdmin);

module.exports = router;
