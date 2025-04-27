import Joi from 'joi';

import {emailRegexp} from '../constants/auth.js';
import {subscriptionList} from '../constants/subscription.js';

export const authRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const authVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.empty': 'Missing required field email',
    'string.pattern.base': 'Invalid email format',
  }),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});
