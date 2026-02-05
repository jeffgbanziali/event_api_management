const express = require('express');
const authRoutes = require('./auth.routes');
const groupRoutes = require('./groups.routes');
const eventRoutes = require('./events.routes');
const threadRoutes = require('./threads.routes');
const albumRoutes = require('./albums.routes');
const pollRoutes = require('./polls.routes');
const ticketRoutes = require('./tickets.routes');
const shoppingRoutes = require('./shopping.routes');
const carpoolRoutes = require('./carpool.routes');
const usersRoutes = require('./users.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupRoutes);
router.use('/events', eventRoutes);
router.use('/', threadRoutes);
router.use('/', albumRoutes);
router.use('/', pollRoutes);
router.use('/', ticketRoutes);
router.use('/', shoppingRoutes);
router.use('/', carpoolRoutes);

module.exports = router;

