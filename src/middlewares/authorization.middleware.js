// Middlewares qui vérifient les droits (admin groupe, organisateur event, participant, etc.)
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

// Même vérification quand la route expose pollId (ex: GET /polls/:pollId/results)
async function requireEventParticipantByPollId(req, res, next) {
  const { pollId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const poll = await pollRepository.findPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: 'Poll not found' });
  }

  const participant = await eventParticipantRepository.findParticipant(poll.event.toString(), userId);
  if (!participant) {
    return res.status(403).json({ error: 'Forbidden: event participant required' });
  }

  return next();
}

// Organisateur OU le user lui-même (pour quitter l'événement)
async function requireEventOrganizerOrSelf(req, res, next) {
  const eventId = req.params.eventId;
  const targetUserId = req.params.userId;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (targetUserId === userId) return next();
  const isOrganizer = await eventParticipantRepository.isOrganizer(eventId, userId);
  if (!isOrganizer) return res.status(403).json({ error: 'Forbidden: event organizer or self required' });
  return next();
}

// Admin du groupe OU le user lui-même (pour quitter le groupe)
async function requireGroupAdminOrSelf(req, res, next) {
  const groupId = req.params.groupId;
  const targetUserId = req.params.userId;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (targetUserId === userId) return next();
  const isAdmin = await groupMembershipRepository.isGroupAdmin(groupId, userId);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden: group admin or self required' });
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

// Organisateur de l'événement lié au sondage (route avec pollId)
async function requirePollOrganizer(req, res, next) {
  const pollId = req.params.pollId;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const poll = await pollRepository.findPollById(pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  const isOrganizer = await eventParticipantRepository.isOrganizer(poll.event.toString(), userId);
  if (!isOrganizer) return res.status(403).json({ error: 'Forbidden: event organizer required' });
  return next();
}

// Organisateur de l'événement lié à la question (route avec questionId)
async function requireOrganizerByQuestionId(req, res, next) {
  const questionId = req.params.questionId;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const question = await pollRepository.findQuestionById(questionId);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const poll = await pollRepository.findPollById(question.poll);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  const isOrganizer = await eventParticipantRepository.isOrganizer(poll.event.toString(), userId);
  if (!isOrganizer) return res.status(403).json({ error: 'Forbidden: event organizer required' });
  return next();
}

// Organisateur de l'événement lié à l'option (route avec optionId)
async function requireOrganizerByOptionId(req, res, next) {
  const optionId = req.params.optionId;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const option = await pollRepository.findOptionById(optionId);
  if (!option) return res.status(404).json({ error: 'Option not found' });

  const question = await pollRepository.findQuestionById(option.question);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const poll = await pollRepository.findPollById(question.poll);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  const isOrganizer = await eventParticipantRepository.isOrganizer(poll.event.toString(), userId);
  if (!isOrganizer) return res.status(403).json({ error: 'Forbidden: event organizer required' });
  return next();
}

// Membre du groupe (pour accès threads / contenu)
async function requireGroupMember(req, res, next) {
  const groupId = req.params.groupId;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const membership = await groupMembershipRepository.findMembership(groupId, userId);
  if (!membership) return res.status(403).json({ error: 'Forbidden: group member required' });
  return next();
}

const threadRepository = require('../infrastructure/mongoose/repositories/thread.repository');
const photoAlbumRepository = require('../infrastructure/mongoose/repositories/photo-album.repository');
const photoRepository = require('../infrastructure/mongoose/repositories/photo.repository');
const commentRepository = require('../infrastructure/mongoose/repositories/comment.repository');

// Participant de l'événement lié à l'album (pour PATCH/DELETE album)
async function requireAlbumEventParticipant(req, res, next) {
  const { albumId } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const album = await photoAlbumRepository.findById(albumId);
  if (!album) return res.status(404).json({ error: 'Album not found' });

  const participant = await eventParticipantRepository.findParticipant(album.event.toString(), userId);
  if (!participant) return res.status(403).json({ error: 'Forbidden: event participant required' });
  return next();
}

// Participant de l'événement lié à la photo (pour PATCH/DELETE photo)
async function requirePhotoEventParticipant(req, res, next) {
  const { photoId } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const photo = await photoRepository.findById(photoId);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });

  const participant = await eventParticipantRepository.findParticipant(photo.event.toString(), userId);
  if (!participant) return res.status(403).json({ error: 'Forbidden: event participant required' });
  return next();
}

// Auteur du commentaire (pour PATCH/DELETE commentaire)
async function requireCommentAuthor(req, res, next) {
  const { commentId } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const comment = await commentRepository.findById(commentId);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  if (comment.author.toString() !== userId) {
    return res.status(403).json({ error: 'Forbidden: comment author only' });
  }
  return next();
}

// Accès au thread : participant de l'événement OU membre du groupe selon le type de thread
async function requireThreadAccess(req, res, next) {
  const threadId = req.params.threadId;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const thread = await threadRepository.findById(threadId);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });

  if (thread.event) {
    const participant = await eventParticipantRepository.findParticipant(thread.event.toString(), userId);
    if (!participant) return res.status(403).json({ error: 'Forbidden: event participant required' });
    return next();
  }
  if (thread.group) {
    const membership = await groupMembershipRepository.findMembership(thread.group.toString(), userId);
    if (!membership) return res.status(403).json({ error: 'Forbidden: group member required' });
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
}

module.exports = {
  requireGroupAdmin,
  requireGroupAdminOrSelf,
  requireEventOrganizer,
  requireEventOrganizerOrSelf,
  requireEventParticipant,
  requireEventParticipantForPoll,
  requireEventParticipantByPollId,
  requireCanCreateEventInGroup,
  requirePollOrganizer,
  requireOrganizerByQuestionId,
  requireOrganizerByOptionId,
  requireGroupMember,
  requireThreadAccess,
  requireAlbumEventParticipant,
  requirePhotoEventParticipant,
  requireCommentAuthor,
};

