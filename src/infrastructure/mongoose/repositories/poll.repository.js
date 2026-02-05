const PollModel = require('../models/poll.model');
const PollQuestionModel = require('../models/poll-question.model');
const PollOptionModel = require('../models/poll-option.model');
const PollResponseModel = require('../models/poll-response.model');

class PollRepository {
  async createPoll({ eventId, title, createdBy }) {
    const poll = new PollModel({
      event: eventId,
      title,
      createdBy,
    });
    return poll.save();
  }

  async findPollById(id) {
    return PollModel.findById(id).exec();
  }

  async listPollsForEvent(eventId) {
    return PollModel.find({ event: eventId }).exec();
  }

  async updatePollById(id, data) {
    return PollModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deletePollById(id) {
    const questions = await PollQuestionModel.find({ poll: id }).exec();
    const questionIds = questions.map((q) => q._id);
    await PollOptionModel.deleteMany({ question: { $in: questionIds } }).exec();
    await PollResponseModel.deleteMany({ poll: id }).exec();
    await PollQuestionModel.deleteMany({ poll: id }).exec();
    return PollModel.findByIdAndDelete(id).exec();
  }

  async createQuestion({ pollId, text, order }) {
    const question = new PollQuestionModel({
      poll: pollId,
      text,
      order,
    });
    return question.save();
  }

  async findQuestionById(id) {
    return PollQuestionModel.findById(id).exec();
  }

  async listQuestionsForPoll(pollId) {
    return PollQuestionModel.find({ poll: pollId }).sort({ order: 1 }).exec();
  }

  async updateQuestionById(id, data) {
    return PollQuestionModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteQuestionById(id) {
    await PollOptionModel.deleteMany({ question: id }).exec();
    await PollResponseModel.deleteMany({ question: id }).exec();
    return PollQuestionModel.findByIdAndDelete(id).exec();
  }

  async createOption({ questionId, text, order }) {
    const option = new PollOptionModel({
      question: questionId,
      text,
      order,
    });
    return option.save();
  }

  async findOptionById(id) {
    return PollOptionModel.findById(id).exec();
  }

  async listOptionsForQuestion(questionId) {
    return PollOptionModel.find({ question: questionId }).sort({ order: 1 }).exec();
  }

  async updateOptionById(id, data) {
    return PollOptionModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteOptionById(id) {
    await PollResponseModel.deleteMany({ option: id }).exec();
    return PollOptionModel.findByIdAndDelete(id).exec();
  }

  async createResponse({ pollId, questionId, optionId, participantId }) {
    const response = new PollResponseModel({
      poll: pollId,
      question: questionId,
      option: optionId,
      participant: participantId,
    });
    return response.save();
  }

  async aggregateResults(pollId) {
    const pipeline = [
      { $match: { poll: pollId } },
      {
        $group: {
          _id: '$option',
          count: { $sum: 1 },
        },
      },
    ];
    return PollResponseModel.aggregate(pipeline);
  }
}

module.exports = new PollRepository();

