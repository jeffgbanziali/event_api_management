// Retourne un middleware qui valide req.body (ou req[property]) avec un schéma Joi
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const data = req[property];
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map((d) => ({ message: d.message, path: d.path })),
      });
    }

    req[property] = value; // on réinjecte les données nettoyées (stripUnknown)
    return next();
  };
}

module.exports = {
  validate,
};

