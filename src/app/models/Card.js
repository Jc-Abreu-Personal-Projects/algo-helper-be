const { DataTypes } = require('sequelize');

const connection = require('../../db/db.js');

const Card = connection.define('card', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  platform: DataTypes.STRING,
  problem_number: DataTypes.INTEGER,
  problem_name: DataTypes.STRING,
  difficulty: DataTypes.STRING,
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
  data_structure: DataTypes.STRING,
  technique: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  card_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Card;