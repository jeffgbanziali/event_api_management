const express = require('express');
const authRoutes = require('./auth.routes');
const groupRoutes = require('./groups.routes');
const eventRoutes = require('./events.routes');
const threadRoutes = require('./threads.routes');
const albumRoutes = require('./albums.routes');
const pollRoutes = require('./polls.routes');
const ticketRoutes = require('./tickets.routes');

// TODO: importer et monter les autres routes (users profile, shopping, carpool)

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/groups', groupRoutes);
router.use('/events', eventRoutes);
router.use('/', threadRoutes);
router.use('/', albumRoutes);
router.use('/', pollRoutes);
router.use('/', ticketRoutes);

module.exports = router;

