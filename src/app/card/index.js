const express = require('express');

const connection = require('../../db/db');

const userController = require('../controllers/user');

const updateHandlers = require('./update');

const getCards = express.Router();
const deleteCard = express.Router();
const updateCards = express.Router();
const createCard = express.Router();

getCards.get("/cards", (req, res) => {
  //Fetches user
  
  // res.send("Retrieved");
});

deleteCard.delete("/", (req, res) => {
  //Deletes user from Database
  

})

createCard.post("/", (req, res) => {

  //WRITES user into Database
  


})

updateCards.use('/', updateHandlers.updateField);

updateCards.use('/position', updateHandlers.updatePositions);

const cardHandlers = {
  getCards: getCards,
  deleteCard: deleteCard,
  updateCards: updateCards,
  createCard: createCard
}

module.exports = cardHandlers;