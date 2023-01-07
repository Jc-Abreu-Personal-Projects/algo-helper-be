const express = require ('express');

const updateHandlers = require ('./update');

const getCards = express.Router();
const deleteCard = express.Router();
const updateCards = express.Router();
const createCard = express.Router();

getCards.get("/cards", (req, res) => {
  res.send("Retrieved");
});

deleteCard.delete("/", (req, res) => {
  res.send("Deleted");
})

createCard.post("/", (req, res) => {
  res.send("Created");
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