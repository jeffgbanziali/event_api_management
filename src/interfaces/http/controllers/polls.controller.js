const {
  createPollSchema,
  createQuestionSchema,
  createOptionSchema,
  voteSchema,
} = require('../../../validation/schemas/poll.validation');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const { createPoll } = require('../../../application/use-cases/polls/create-poll.usecase');
const { createQuestion } = require('../../../application/use-cases/polls/create-question.usecase');
const { createOption } = require('../../../application/use-cases/polls/create-option.usecase');
const { vote } = require('../../../application/use-cases/polls/vote.usecase');
const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

// Middlewares de validation adaptés aux contrôleurs
const validateCreatePoll = validate(createPollSchema);
const validateCreateQuestion = validate(createQuestionSchema);
const validateCreateOption = validate(createOptionSchema);
const validateVote = validate(voteSchema);

async function createEventPoll(req, res, next) {
  try {
    const poll = await createPoll(
      {
        eventId: req.params.eventId,
        title: req.body.title,
      },
      req.user.id
    );
    res.status(201).json(poll);
  } catch (err) {
    next(err);
  }
}

async function listEventPolls(req, res, next) {
  try {
    const polls = await pollRepository.listPollsForEvent(req.params.eventId);
    res.json(polls);
  } catch (err) {
    next(err);
  }
}

async function addQuestion(req, res, next) {
  try {
    const question = await createQuestion({
      pollId: req.params.pollId,
      text: req.body.text,
      order: req.body.order,
    });
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
}

async function addOption(req, res, next) {
  try {
    const option = await createOption({
      questionId: req.params.questionId,
      text: req.body.text,
      order: req.body.order,
    });
    res.status(201).json(option);
  } catch (err) {
    next(err);
  }
}

async function voteOnQuestion(req, res, next) {
  try {
    const response = await vote(
      {
        optionId: req.body.optionId,
      },
      req.user.id
    );
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreatePoll,
  validateCreateQuestion,
  validateCreateOption,
  validateVote,
  createEventPoll,
  listEventPolls,
  addQuestion,
  addOption,
  voteOnQuestion,
};

