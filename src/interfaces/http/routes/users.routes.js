// Routes profil : GET/PATCH /users/me (user connecté)
const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.get('/me', authMiddleware, usersController.me);
router.patch('/me', authMiddleware, usersController.validateUpdateProfile, usersController.updateMe);

module.exports = router;
