const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../../config/env');
const userRepository = require('../../../infrastructure/mongoose/repositories/user.repository');

async function loginUser(input) {
  const user = await userRepository.findByEmail(input.email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const payload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    },
  };
}

module.exports = {
  loginUser,
};

