const { DataTypes } = require('sequelize');

const connection = require('../../db/db.js');

const Card = connection.define('Card', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date_created: {
    type: DataTypes.DATEONLY,
  },
  platform: DataTypes.STRING,
  problem_number: DateTypes.INTEGER,
  problem_name: DateTypes.STRING,
  difficulty: DateTypes.STRING,
  user_id: DataTypes.INTEGER,
  status: DataTypes.STRING,
  time_completed: DataTypes.INTEGER,
  completed: DataTypes.BOOLEAN,
  solution_lookup: DataTypes.BOOLEAN,
  description: DataTypes.STRING,
  inputs: DataTypes.STRING,
  expected_outputs: DataTypes.STRING,
  constraints: DataTypes.STRING,
  space_complexity: DataTypes.STRING,
  time_complexity: DataTypes.STRING,
  comments: DataTypes.STRING,
  datastructure: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    allowNull: false  
  },
  order: {
    type: DataTypes.INTEGER
    allowNull: false
  }
})

module.exports = Card;