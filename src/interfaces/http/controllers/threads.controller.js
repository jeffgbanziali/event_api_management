const { validate } = require('../../../validation/middlewares/validate.middleware');
const { createThreadSchema, createMessageSchema } = require('../../../validation/schemas/thread.validation');
const { createEventThread } = require('../../../application/use-cases/threads/create-event-thread.usecase');
const { createGroupThread } = require('../../../application/use-cases/threads/create-group-thread.usecase');
const { postMessage } = require('../../../application/use-cases/threads/post-message.usecase');
const threadRepository = require('../../../infrastructure/mongoose/repositories/thread.repository');
const messageRepository = require('../../../infrastructure/mongoose/repositories/message.repository');

const validateCreateThread = validate(createThreadSchema);
const validateCreateMessage = validate(createMessageSchema);

async function createEventThreadHandler(req, res, next) {
  try {
    const thread = await createEventThread(
      { eventId: req.params.eventId, title: req.body.title },
      req.user.id
    );
    res.status(201).json(thread);
  } catch (err) {
    next(err);
  }
}

async function listEventThreads(req, res, next) {
  try {
    const threads = await threadRepository.listForEvent(req.params.eventId);
    res.json(threads);
  } catch (err) {
    next(err);
  }
}

async function createGroupThreadHandler(req, res, next) {
  try {
    const thread = await createGroupThread(
      { groupId: req.params.groupId, title: req.body.title },
      req.user.id
    );
    res.status(201).json(thread);
  } catch (err) {
    next(err);
  }
}

async function listGroupThreads(req, res, next) {
  try {
    const threads = await threadRepository.listForGroup(req.params.groupId);
    res.json(threads);
  } catch (err) {
    next(err);
  }
}

async function postMessageHandler(req, res, next) {
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

async function listMessages(req, res, next) {
  try {
    const messages = await messageRepository.listForThread(req.params.threadId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateThread,
  validateCreateMessage,
  createEventThreadHandler,
  listEventThreads,
  createGroupThreadHandler,
  listGroupThreads,
  postMessageHandler,
  listMessages,
};
