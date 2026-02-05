const { validate } = require('../../../validation/middlewares/validate.middleware');
const { updateProfileSchema } = require('../../../validation/schemas/user.validation');
const { getMe } = require('../../../application/use-cases/users/get-me.usecase');
const { updateProfile } = require('../../../application/use-cases/users/update-profile.usecase');

const validateUpdateProfile = validate(updateProfileSchema);

async function me(req, res, next) {
  try {
    const user = await getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateUpdateProfile,
  me,
  updateMe,
};
