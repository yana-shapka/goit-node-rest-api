import bcrypt from 'bcrypt';

import User from '../db/models/user.js';

import httpError from '../helpers/httpError.js';

import {generateToken} from '../helpers/jwt.js';

export const findUser = query =>
  User.findOne({
    where: query,
  });

  export const registerUser = async data => {
    const {email, password} = data;
    const user = await User.findOne({
        where: {
            email
        }
    });

    if(user) {
        throw httpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return User.create({...data, password: hashPassword});
}

export const loginUser = async data => {
    const {email, password} = data;
    const user = await User.findOne({
        where: {
            email
        }
    });
    
    if(!user) {
        throw httpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw httpError(401, "Email or password is wrong");
    }

    const payload = {
        email
    };
    const token = generateToken(payload);

    await user.update({token});

    return {
        token,
    };
}

export const logoutUser = async id => {
    const user = await findUser({id});
    if(!user || !user.token) {
        throw httpError(401, "Not authorized");
    }

    await user.update({token: null});
}

export const updateUserSubscription = async (id, subscription) => {
    const user = await User.findByPk(id);
    if (!user) {
      throw httpError(404, 'User not found');
    }
  
    await user.update({ subscription });
    return user;
  };