const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const {
  createThreadSchema,
  createMessageSchema,
} = require('../../../validation/schemas/thread.validation');
const { createEventThread } = require('../../../application/use-cases/threads/create-event-thread.usecase');
const { postMessage } = require('../../../application/use-cases/threads/post-message.usecase');
const threadRepository = require('../../../infrastructure/mongoose/repositories/thread.repository');
const messageRepository = require('../../../infrastructure/mongoose/repositories/message.repository');
const { requireEventParticipant } = require('../../../middlewares/authorization.middleware');

const router = express.Router();

// Créer un fil de discussion pour un événement
router.post(
  '/events/:eventId/threads',
  authMiddleware,
  requireEventParticipant,
  validate(createThreadSchema),
  async (req, res, next) => {
    try {
      const thread = await createEventThread(
        {
          eventId: req.params.eventId,
          title: req.body.title,
        },
        req.user.id
      );
      res.status(201).json(thread);
    } catch (err) {
      next(err);
    }
  }
);

// Lister les fils de discussion d'un événement
router.get(
  '/events/:eventId/threads',
  authMiddleware,
  requireEventParticipant,
  async (req, res, next) => {
    try {
      const threads = await threadRepository.listForEvent(req.params.eventId);
      res.json(threads);
    } catch (err) {
      next(err);
    }
  }
);

// Poster un message dans un thread
router.post(
  '/threads/:threadId/messages',
  authMiddleware,
  validate(createMessageSchema),
  async (req, res, next) => {
    try {
      const message = await postMessage(
        {
          threadId: req.params.threadId,
          content: req.body.content,
          parentMessageId: req.body.parentMessageId,
        },
        req.user.id
      );
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  }
);

// Lister les messages d'un thread
router.get('/threads/:threadId/messages', authMiddleware, async (req, res, next) => {
  try {
    const messages = await messageRepository.listForThread(req.params.threadId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

