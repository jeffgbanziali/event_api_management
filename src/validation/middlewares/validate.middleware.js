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

    req[property] = value;
    return next();
  };
}

module.exports = {
  validate,
};

