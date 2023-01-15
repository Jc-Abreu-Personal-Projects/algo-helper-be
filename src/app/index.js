let express = require('express');

let router = express.Router();
let cardActions = require('./card/index');
let userHandlers = require('./user/index');



router.use('/', cardActions.getCards);

router.use('/', userHandlers.getUser);

router.use('/', userHandlers.deleteUser);

router.use('/', userHandlers.registerUser);

router.use('/update', cardActions.updateCards);

router.use('/create', cardActions.createCard);

router.use('/delete', cardActions.deleteCard);

module.exports = router;