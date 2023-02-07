const express = require("express");
const cardController = require('../controllers/card');

const updateField = express.Router();
const updatePositions = express.Router();

updateField.patch('/field', (req, res) => {
  //Edits specific field for a specific Card
  console.log(req.query);
  const { userId, cardId, field, newValue } = req.query;
  cardController.editCardField(res, userId, cardId, field, newValue);
})

updatePositions.patch('/', (req, res) => {
  const { userId, cardId, newOrderNumber, oldStatus, newStatus } = req.query;

  //Update status and order number for specific card
  //reorder list under oldStatus
  //reorder list under newStatus
  cardController.addExistingCardToList(res, userId, newStatus, oldStatus, newOrderNumber, cardId);

})

const updateHandlers = {
  updateField: updateField,
  updatePositions: updatePositions
}

module.exports = updateHandlers;