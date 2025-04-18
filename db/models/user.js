import sequelize from '../sequelize.js';
import {DataTypes} from 'sequelize';

import {emailRegexp} from '../../constants/auth.js';
import {subscriptionList} from '../../constants/subscription.js';

const User = sequelize.define('user', {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: emailRegexp,
    },
  },
  subscription: {
    type: DataTypes.ENUM,
    values: subscriptionList,
    defaultValue: 'starter',
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

export default User;
