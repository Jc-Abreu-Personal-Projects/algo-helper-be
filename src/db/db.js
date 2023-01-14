const { Sequelize } = require('sequelize');

const dbConfig = require("./dbConfig");

const connection = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port
});


async function testConnection() {
  try {
    connection.authenticate();
    console.log('Connection has been established successfully');
  } catch (error) {
    console.log('Unable to connect to the database');
  }
}

testConnection();


module.exports = connection;

