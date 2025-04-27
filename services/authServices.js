import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import {nanoid} from 'nanoid';

import User from '../db/models/user.js';

import httpError from '../helpers/httpError.js';

import {generateToken} from '../helpers/jwt.js';
import sendEmail from '../helpers/sendEmail.js';

import {generateAvatarFilePath} from '../constants/avatarName.js';

const {APP_DOMAIN} = process.env;

export const findUser = query =>
  User.findOne({
    where: query,
  });

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: 'Verify email',
  html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationToken}" target="_blank">Verify email</a>`,
});

export const registerUser = async data => {
  const {email, password} = data;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    throw httpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();
  const gravatarURL = gravatar.url(email, {s: '250', d: 'retro'}, true);

  const response = await axios.get(gravatarURL, {responseType: 'arraybuffer'});

  const {fileName, filePath} = generateAvatarFilePath(email);

  await fs.writeFile(filePath, response.data);

  const avatarURL = `/avatars/${fileName}`;

  const verifyEmail = createVerifyEmail(email, verificationToken);

  await sendEmail(verifyEmail);

  return User.create({
    ...data,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
};

export const verifyUser = async verificationToken => {
  const user = await findUser({verificationToken});
  if (!user) {
    throw httpError(404, 'User not found');
  }

  await user.update({verificationToken: null, verify: true});
};

export const resendVerifyEmail = async email => {
  const user = await findUser({email});
  if (!user) {
    throw httpError(404, 'Email not found');
  }
  if (user.verify) {
    throw httpError(400, 'Verification has already been passed');
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);
};

export const loginUser = async data => {
  const {email, password} = data;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw httpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw httpError(401, 'Email not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw httpError(401, 'Email or password is wrong');
  }

  const payload = {
    email,
  };
  const token = generateToken(payload);

  await user.update({token});

  return {
    token,
  };
};

export const logoutUser = async id => {
  const user = await findUser({id});
  if (!user || !user.token) {
    throw httpError(401, 'Not authorized');
  }

  await user.update({token: null});
};

export const updateUserSubscription = async (id, subscription) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw httpError(404, 'User not found');
  }

  await user.update({subscription});
  return user;
};

export const updateUserAvatar = async (id, avatarURL) => {
  const user = await User.findByPk(id);
  if (!user) throw httpError(404, 'User not found');

  await user.update({avatarURL});
  return user;
};
