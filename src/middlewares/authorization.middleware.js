const groupMembershipRepository = require('../infrastructure/mongoose/repositories/group-membership.repository');
const eventParticipantRepository = require('../infrastructure/mongoose/repositories/event-participant.repository');
const GroupModel = require('../infrastructure/mongoose/models/group.model');
const pollRepository = require('../infrastructure/mongoose/repositories/poll.repository');

async function requireGroupAdmin(req, res, next) {
  const { groupId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const isAdmin = await groupMembershipRepository.isGroupAdmin(groupId, userId);
  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden: group admin required' });
  }

  return next();
}

async function requireEventOrganizer(req, res, next) {
  const { eventId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const isOrganizer = await eventParticipantRepository.isOrganizer(eventId, userId);
  if (!isOrganizer) {
    return res.status(403).json({ error: 'Forbidden: event organizer required' });
  }

  return next();
}

async function requireEventParticipant(req, res, next) {
  const { eventId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const participant = await eventParticipantRepository.findParticipant(eventId, userId);
  if (!participant) {
    return res.status(403).json({ error: 'Forbidden: event participant required' });
  }

  return next();
}

// Vérifie que l'utilisateur est participant de l'événement lié au poll (via eventId dans params)
async function requireEventParticipantForPoll(req, res, next) {
  const { eventId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const participant = await eventParticipantRepository.findParticipant(eventId, userId);
  if (!participant) {
    return res.status(403).json({ error: 'Forbidden: event participant required' });
  }

  return next();
}

async function requireCanCreateEventInGroup(req, res, next) {
  const { groupId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const group = await GroupModel.findById(groupId).exec();
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  const membership = await groupMembershipRepository.findMembership(groupId, userId);
  if (!membership) {
    return res.status(403).json({ error: 'Forbidden: group member required' });
  }

  if (group.allowMembersToCreateEvents || membership.role === 'admin') {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden: not allowed to create events in this group' });
}

module.exports = {
  requireGroupAdmin,
  requireEventOrganizer,
  requireEventParticipant,
  requireEventParticipantForPoll,
  requireCanCreateEventInGroup,
};

