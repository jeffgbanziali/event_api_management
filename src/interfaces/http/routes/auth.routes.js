const express = require('express');
const { registerSchema, loginSchema } = require('../../../validation/schemas/auth.validation');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;

