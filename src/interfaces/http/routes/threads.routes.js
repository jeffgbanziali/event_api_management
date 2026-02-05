// Routes threads (event ou groupe) et messages : accès selon participant event ou membre groupe
const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireEventParticipant, requireGroupMember, requireThreadAccess } = require('../../../middlewares/authorization.middleware');
const threadsController = require('../controllers/threads.controller');

const router = express.Router();

router.post(
  '/events/:eventId/threads',
  authMiddleware,
  requireEventParticipant,
  threadsController.validateCreateThread,
  threadsController.createEventThreadHandler
);
router.get(
  '/events/:eventId/threads',
  authMiddleware,
  requireEventParticipant,
  threadsController.listEventThreads
);

router.post(
  '/groups/:groupId/threads',
  authMiddleware,
  requireGroupMember,
  threadsController.validateCreateThread,
  threadsController.createGroupThreadHandler
);
router.get(
  '/groups/:groupId/threads',
  authMiddleware,
  requireGroupMember,
  threadsController.listGroupThreads
);

router.post(
  '/threads/:threadId/messages',
  authMiddleware,
  requireThreadAccess,
  threadsController.validateCreateMessage,
  threadsController.postMessageHandler
);
router.get(
  '/threads/:threadId/messages',
  authMiddleware,
  requireThreadAccess,
  threadsController.listMessages
);

module.exports = router;
