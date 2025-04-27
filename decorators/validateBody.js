import httpError from '../helpers/httpError.js';

const validateBody = schema => {
  const func = (req, res, next) => {
    const {error} = schema.validate(req.body, {abortEarly: false});

    if (error) {
      const missingFieldError = error.details.find(
        detail => detail.type === 'any.required'
      );
      if (missingFieldError) {
        const missingFieldName = missingFieldError.context.key;
        return next(
          httpError(400, `Missing required field ${missingFieldName}`)
        );
      }

      return next(httpError(400, error.details[0].message));
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(httpError(400, 'Request body cannot be empty'));
    }

    next();
  };
  return func;
};

export default validateBody;
