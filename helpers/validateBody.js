import httpError from './httpError.js';

const validateBody = schema => {
  return (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(httpError(400, 'Body must have at least one field'));
    }

    const {error} = schema.validate(req.body);
    if (error) {
      return next(httpError(400, error.message));
    }

    return next();
  };
};

export default validateBody;
