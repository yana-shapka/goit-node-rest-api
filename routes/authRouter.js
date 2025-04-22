import express from 'express';

import authenticate from '../middlewares/authenticate.js';

import authControllers from '../controllers/authControllers.js';

import validateBody from '../decorators/validateBody.js';

import {
  authRegisterSchema,
  authLoginSchema,
  subscriptionSchema,
} from '../schemas/authSchemas.js';

import upload from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  authControllers.registerController
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  authControllers.loginController
);

authRouter.post('/logout', authenticate, authControllers.logoutController);

authRouter.get(
  '/current',
  authenticate,
  authControllers.getCurrentUserController
);

authRouter.patch(
  '/subscription',
  authenticate,
  validateBody(subscriptionSchema),
  authControllers.updateSubscriptionController
);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authControllers.updateAvatarController
);

export default authRouter;
