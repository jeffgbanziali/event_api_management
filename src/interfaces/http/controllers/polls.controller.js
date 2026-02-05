// Contrôleur sondages : création poll/questions/options, vote, résultats agrégés, CRUD (organisateur)
const {
  createPollSchema,
  createQuestionSchema,
  createOptionSchema,
  voteSchema,
  updatePollSchema,
  updateQuestionSchema,
  updateOptionSchema,
} = require('../../../validation/schemas/poll.validation');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const { createPoll } = require('../../../application/use-cases/polls/create-poll.usecase');
const { updatePoll } = require('../../../application/use-cases/polls/update-poll.usecase');
const { deletePoll } = require('../../../application/use-cases/polls/delete-poll.usecase');
const { createQuestion } = require('../../../application/use-cases/polls/create-question.usecase');
const { updateQuestion } = require('../../../application/use-cases/polls/update-question.usecase');
const { deleteQuestion } = require('../../../application/use-cases/polls/delete-question.usecase');
const { createOption } = require('../../../application/use-cases/polls/create-option.usecase');
const { updateOption } = require('../../../application/use-cases/polls/update-option.usecase');
const { deleteOption } = require('../../../application/use-cases/polls/delete-option.usecase');
const { vote } = require('../../../application/use-cases/polls/vote.usecase');
const { getPollResults } = require('../../../application/use-cases/polls/get-poll-results.usecase');
const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

const validateCreatePoll = validate(createPollSchema);
const validateCreateQuestion = validate(createQuestionSchema);
const validateCreateOption = validate(createOptionSchema);
const validateVote = validate(voteSchema);
const validateUpdatePoll = validate(updatePollSchema);
const validateUpdateQuestion = validate(updateQuestionSchema);
const validateUpdateOption = validate(updateOptionSchema);

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

async function getResults(req, res, next) {
  try {
    const results = await getPollResults(req.params.pollId);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

async function updateEventPoll(req, res, next) {
  try {
    const poll = await updatePoll(req.params.pollId, req.body);
    res.json(poll);
  } catch (err) {
    next(err);
  }
}

async function deleteEventPoll(req, res, next) {
  try {
    await deletePoll(req.params.pollId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function updatePollQuestion(req, res, next) {
  try {
    const question = await updateQuestion(req.params.questionId, req.body);
    res.json(question);
  } catch (err) {
    next(err);
  }
}

async function deletePollQuestion(req, res, next) {
  try {
    await deleteQuestion(req.params.questionId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function updateQuestionOption(req, res, next) {
  try {
    const option = await updateOption(req.params.optionId, req.body);
    res.json(option);
  } catch (err) {
    next(err);
  }
}

async function deleteQuestionOption(req, res, next) {
  try {
    await deleteOption(req.params.optionId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreatePoll,
  validateCreateQuestion,
  validateCreateOption,
  validateVote,
  validateUpdatePoll,
  validateUpdateQuestion,
  validateUpdateOption,
  createEventPoll,
  listEventPolls,
  updateEventPoll,
  deleteEventPoll,
  addQuestion,
  updatePollQuestion,
  deletePollQuestion,
  addOption,
  updateQuestionOption,
  deleteQuestionOption,
  voteOnQuestion,
  getResults,
};

