const userRepository = require('../../../infrastructure/mongoose/repositories/user.repository');

async function updateProfile(userId, data) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  const updated = await userRepository.updateById(userId, {
    ...(data.firstName !== undefined && { firstName: data.firstName }),
    ...(data.lastName !== undefined && { lastName: data.lastName }),
    ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl || null }),
  });
  return {
    id: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    avatarUrl: updated.avatarUrl,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

module.exports = {
  updateProfile,
};
