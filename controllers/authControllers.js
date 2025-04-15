import * as authServices from '../services/authServices.js';

import ctrlWrapper from '../decorators/ctrlWrapper.js';

const registerController = async (req, res) => {
  const newUser = await authServices.registerUser(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const loginController = async (req, res) => {
  const {token} = await authServices.loginUser(req.body);

  const user = await authServices.findUser({email: req.body.email});

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrentUserController = (req, res) => {
    const { email, subscription } = req.user;
  
    res.status(200).json({
      email,
      subscription,
    });
  };

const logoutController = async (req, res) => {
  const {id} = req.user;
  await authServices.logoutUser(id);

  res.sendStatus(204);
};

const updateSubscriptionController = async (req, res) => {
    const { id } = req.user;
    const { subscription } = req.body;
  
    const user = await authServices.updateUserSubscription(id, subscription);
  
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  };

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getCurrentUserController: ctrlWrapper(getCurrentUserController),
  logoutController: ctrlWrapper(logoutController),
  updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
};
