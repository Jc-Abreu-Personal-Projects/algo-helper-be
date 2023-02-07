const { Op } = require('sequelize');
const Card = require('../models/Card');
const sequelize = require('../../db/db');

async function createCard(res, cardInfo, userId) {

  const { id, platform, problemNumber, problemName, difficulty,
    status, timeCompleted, completed, solutionLookup, description,
    inputs, expectedOutputs, constraints, spaceComplexity, timeComplexity,
    comments, dataStructure, technique } = cardInfo;

  try {
    //Create new card with given parameters
    const response = await Card.create({
      platform: platform,
      problem_number: problemNumber,
      problem_name: problemName,
      difficulty: difficulty,
      user_id: userId,
      status: status,
      time_completed: timeCompleted,
      completed: completed,
      solution_lookup: solutionLookup,
      description: description,
      inputs: inputs,
      expected_outputs: expectedOutputs,
      constraints: constraints,
      space_complexity: spaceComplexity,
      time_complexity: timeComplexity,
      comments: comments,
      data_structure: dataStructure,
      status: status,
      //-1 because its added to the front of the stack of cards
      //Card order gets updated to 0 when reorderlist is called.
      card_order: -1
    })

    //Convert to JSON
    const package = response.toJSON();

  } catch (error) {
    console.log(error);
    console.log("Card not Created");

    //Bad Request via Client
    res.sendStatus(400);
  } finally {
    reorderList(res, status, userId);
  }
}

async function deleteCard(res, cardId, userId, status) {

  try {
    try {
      //Delete user from database
      const response = await Card.destroy({
        where: {
          id: cardId
        }
      });

      console.log("Card Deleted");
    } catch (error) {
      console.log(error);
      console.log("Card not deleted");
    } finally {
      //Reorder list for respecful user and card status
      reorderList(res, status, userId);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }

}

async function fetchCards(res, userId) {

  const query = `SELECT c.status, JSON_ARRAYAGG(
       JSON_OBJECT('id', cards.id, 'platform', cards.platform, 'problemName', cards.problem_name, 'problemNumber', cards.problem_number, 'difficulty', cards.difficulty, 'userId', cards.user_id, 'status', cards.status, 'timeCompleted', cards.time_completed, 'completed', cards.completed, 'solutionLookup', cards.solution_lookup, 'completed', cards.completed, 'solutionLookup', cards.solution_lookup, 'description', cards.description, 'inputs', cards.inputs, 'expectedOutputs', cards.expected_outputs, 'constraints', cards.constraints, 'spaceComplexity', cards.space_complexity, 'timeComplexity', cards.time_complexity, 'comments', cards.comments, 'dataStructure', cards.data_structure, 'technique', cards.technique, 'cardOrder', cards.card_order, 'createdAt', cards.createdAt, 'updatedAt', cards.updatedAt)) AS RESULT FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY card_order) FROM cards WHERE user_id = ${userId} AND (user_id = ${userId} OR user_id IS NULL)) as c LEFT JOIN cards ON cards.user_id = ${userId} GROUP BY c.status;`;


  try {
    const Cards = await sequelize.query(query);
    //Adds missing statuses
    let reshapedData = {
      todo: [],
      revisit: [],
      done: [],
      refresh: []
    }

    Cards[0].map(group => {
      reshapedData[group.status] = group.RESULT;
    })

    res.send([reshapedData]);
  } catch (error) {
    console.log(error);
    console.log('Cards not Found');
    res.sendStatus(404);
  }
}

//REORDER LIST,
// Reorder affected lists 
async function reorderList(res, status, userId, oldStatus) {

  //This query updates the order of cards in the list, it makes it so each row within its respectful list for a user be a difference of one
  let query = `UPDATE cards JOIN (SELECT * FROM cards WHERE status = "${status}" AND user_id = "${userId}" ORDER BY card_order) as c SET
  cards.card_order = @rownum := @rownum+1, cards.updatedAt = NOW() WHERE cards.id = c.id;`

  try {
    await sequelize.query('SET @rownum := -1;');
    const Cards = await sequelize.query(query);

    console.log('list updated');
    if (!oldStatus) {
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    console.log('list not updated');
    res.sendStatus(404);
  } finally {
    //UPDATE oldStatus if oldList is not undefined
    if (oldStatus) {

      query = `UPDATE cards JOIN (SELECT * FROM cards WHERE status = "${oldStatus}" AND user_id = "${userId}" ORDER BY card_order) as c SET
      cards.card_order = @rownum := @rownum+1, cards.updatedAt = NOW() WHERE cards.id = c.id;`

      try {
        await sequelize.query('SET @rownum := -1;');
        const Cards = await sequelize.query(query);

        console.log('list updated');
        res.sendStatus(200);

      } catch (error) {
        console.log(error);
        console.log('list not updated');
        res.sendStatus(404);
      }
    } else {
      return;
    }
  }
}

async function addExistingCardToList(res, userId, newStatus, oldStatus, newOrderNumber, cardId) {

  const query = `UPDATE cards SET card_order = "${newOrderNumber}", status = "${newStatus}" WHERE user_id = "${userId}" AND id = "${cardId}"`;

  try {
    const Cards = await sequelize.query(query);

    console.log('Position changed');
  } catch (error) {
    console.log(error);
    console.log('position failed to change');
  } finally {
    await reorderList(res, newStatus, userId, oldStatus);
  }
}

const fieldTranslations = {
  problemNumber: 'problem_number',
  problemName: 'problem_name',
  timeCompleted: 'time_completed',
  solutionLookup: 'solution_lookup',
  expectedOutputs: 'expected_outputs',
  spaceComplexity: 'space_complexity',
  timeComplexity: 'time_complexity',
  dataStructure: 'data_structure'
}

async function editCardField(res, userId, cardId, field, newValue) {

  //Reassign field if given field has two or more words
  if (fieldTranslations[field]) field = fieldTranslations[field];

  const query = `UPDATE cards SET ${field} = "${newValue}", updatedAt = NOW() WHERE user_id = "${userId}" AND id = "${cardId}"`;

  try {
    const Cards = await sequelize.query(query);
    console.log("Card Info Changed")
    res.sendStatus(201);
  } catch (error) {
    console.log(error, 'Card Info Not Changed');
    res.sendStatus(404);
  }
}

//Package controller methods in an object
const cardController = {
  createCard: createCard,
  deleteCard: deleteCard,
  fetchCards: fetchCards,
  addExistingCardToList: addExistingCardToList,
  editCardField: editCardField
}

//Export Methods
module.exports = cardController;