const validateRequest = (schemas) => {
  return (req, res, next) => {
    const parts = ['body', 'params', 'query'];
    const validated = {};
    const errors = [];

    for (const part of parts) {
      const schema = schemas[part];

      if (!schema) {
        validated[part] = req[part];
        continue;
      }

      const { error, value } = schema.validate(req[part], {
        abortEarly: false,
        convert: true,
        allowUnknown: false,
        stripUnknown: false
      });

      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            field: `${part}.${detail.path.join('.')}`,
            message: detail.message,
            type: detail.type
          }))
        );
      } else {
        validated[part] = value;
      }
    }

    if (errors.length) {
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        errors
      });
    }

    req.validated = validated;
    next();
  };
};

module.exports = validateRequest;