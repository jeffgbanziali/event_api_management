// Dernier middleware : attrape toutes les erreurs passées à next(err)

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  let status = err.status;
  let message = err.message || 'Internal Server Error';

  // Si le use-case n'a pas mis err.status, on déduit du type d'erreur
  if (status == null) {
    if (err.code === 11000) {
      status = 409;
      message = 'Resource already exists (duplicate key)';
    } else if (err.name === 'ValidationError') {
      status = 400;
      message = err.message;
    } else {
      status = 500;
      message = 'Internal Server Error';
    }
  }

  res.status(status).json({ error: message });
}

module.exports = {
  errorHandler,
};

