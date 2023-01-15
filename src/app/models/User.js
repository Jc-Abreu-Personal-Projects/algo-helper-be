const { DataTypes } = require('sequelize');

const connection = require('../../db/db.js');

const User = connection.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  industry_status: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

connection.sync();

module.exports = User;