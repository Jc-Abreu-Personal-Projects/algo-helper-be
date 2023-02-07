const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const upload = multer();


app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(upload.array());
app.use(express.static('public'));

//DATABASE
const connection = require('../../db/db');
//Card Controller methods
const cardController = require('../controllers/card');
//Update Request Handlers
const updateHandlers = require('./update');
//ROUTES
const getCards = express.Router();
const deleteCard = express.Router();
const updateCards = express.Router();
const createCard = express.Router();

//Fetches Card
getCards.get("/cards", (req, res) => {

  const { userId } = req.query;
  console.log(userId);
  cardController.fetchCards(res, parseInt(userId));

});

//Deletes Card from Database
deleteCard.delete("/", (req, res) => {

  const { cardId, userId, status } = req.query;
  cardController.deleteCard(res, parseInt(cardId), parseInt(userId), status);

})

//WRITES Card into Database
createCard.post("/", upload.none(), (req, res) => {

  const { userId } = req.body;
  delete req.body.userId;
  cardController.createCard(res, req.body, userId);

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