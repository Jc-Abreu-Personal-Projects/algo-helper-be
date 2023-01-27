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

  const query = `SELECT status, JSON_ARRAYAGG(
    JSON_OBJECT('id', id, 'platform', platform, 'problemNumber', problem_number, 'difficulty', difficulty, 'userId', user_id, 'status', status, 'timeCompleted', time_completed, 'completed', completed, 'solutionLookup', solution_lookup, 'completed', completed, 'solutionLookup', solution_lookup, 'description', description, 'inputs', inputs, 'expectedOutputs', expected_outputs, 'constraints', constraints, 'spaceComplexity', space_complexity, 'timeComplexity', time_complexity, 'comments', comments, 'dataStructure', data_structure, 'technique', technique, 'cardOrder', card_order, 'createdAt', createdAt, 'updatedAt', updatedAt)) AS RESULT FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY card_order) FROM cards WHERE user_id = ${userId})
     as cards GROUP BY status;`;

  try {
    const Cards = await sequelize.query(query);

    console.log('Cards Found');
    res.send(Cards);
  } catch (error) {
    console.log(error);
    console.log('Cards not Found');
    res.sendStatus(404);
  }
}

//REORDER LIST,
// Reorder affected lists 
async function reorderList(res, status, userId, oldStatus) {

  // const query = `UPDATE cards SET card_order = @rownum := @rownum +1 WHERE status = "${status}" AND user_id = "${userId}" ORDER BY card_order`;

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

// const { id, platform, problemNumber, problemName, difficulty,
//   status, timeCompleted, completed, solutionLookup, description,
//   inputs, expectedOutputs, constraints, spaceComplexity, timeComplexity,
//   comments, dataStructure, technique } = cardInfo;

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