const express = require("express");

const updateField = express.Router();
const updatePositions = express.Router();

updateField.patch('/field', (req, res) => {
  res.send("updated field");
})

updatePositions.patch('/', (req, res) => {
  res.send("updated position");
})

const updateHandlers = {
  updateField: updateField,
  updatePositions: updatePositions
}

module.exports = updateHandlers;