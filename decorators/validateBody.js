import httpError from '../helpers/httpError.js';

const validateBody = schema => {
  const func = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(httpError(400, 'Request body cannot be empty'));
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return next(httpError(400, error.message));
    }

    next();
  };
  return func;
};

export default validateBody;