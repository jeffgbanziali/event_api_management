const bcrypt = require('bcrypt');
const userRepository = require('../../../infrastructure/mongoose/repositories/user.repository');

async function registerUser(input) {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const created = await userRepository.create({
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
  });

  return {
    id: created.id,
    email: created.email,
    firstName: created.firstName,
    lastName: created.lastName,
    avatarUrl: created.avatarUrl,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  };
}

module.exports = {
  registerUser,
};

