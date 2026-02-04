// Middleware global de gestion des erreurs
// On garde volontairement une version simple pour le moment.

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // TODO: améliorer la gestion des erreurs (DomainError, validation, etc.)
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ error: message });
}

module.exports = {
  errorHandler,
};

