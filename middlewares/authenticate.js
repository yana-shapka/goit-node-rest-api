import httpError from "../helpers/httpError.js";

import { findUser } from "../services/authServices.js";

import { verifyToken } from "../helpers/jwt.js";

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(httpError(401, "Not authorized"));
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      return next(httpError(401, "Not authorized"));
    }
    const { payload, error } = verifyToken(token);
    if (error) {
      return next(httpError(401, error.message));
    }
    const user = await findUser({ email: payload.email });
    if (!user || !user.token) {
      return next(httpError(401, "Not authorized"));
    }
    req.user = user;
    next(); 
};

export default authenticate;
