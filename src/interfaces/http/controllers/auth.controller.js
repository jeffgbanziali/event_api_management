const { registerUser } = require('../../../application/use-cases/auth/register-user.usecase');
const { loginUser } = require('../../../application/use-cases/auth/login-user.usecase');

// Inscription : le body est déjà validé par le middleware (registerSchema)
async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Connexion : renvoie accessToken + infos user
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

