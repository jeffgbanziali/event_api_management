const { registerUser } = require('../../../application/use-cases/auth/register-user.usecase');
const { loginUser } = require('../../../application/use-cases/auth/login-user.usecase');

async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};

