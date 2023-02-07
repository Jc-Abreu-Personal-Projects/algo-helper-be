const express = require('express');
const app = express();
const userController = require('../controllers/user');
const validateCredentials = require('../../utility/validate/userValidation');

const getUser = express.Router();
const deleteUser = express.Router();
const registerUser = express.Router();

app.use(express.json());

getUser.get('/signin', (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const email = auth[0];
    const password = auth[1];

    //check email and password
    if (!validateCredentials.validateEmail(email) || !validateCredentials.validatePassword(password)) {
      res.sendStatus(400);
      return;
    }

    userController.fetchUserInfo(res, email, password);
  } else {
    res.sendStatus(400);
  }
})

deleteUser.delete('/delete/user', (req, res) => {
  //Extract userId
  const { userId } = req.body;
  //Verify if valid integer
  if (userId > -1) {
    userController.deleteUser(res, userId);
  } else {
    res.sendStatus(400);
  }
})

registerUser.post('/register', (req, res) => {
  //Access to authorization headers
  const authHeader = req.headers.authorization;
  //Assign to req.body
  const userInfo = req.body;
  if (authHeader) {
    //Extract and translate email and password
    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const email = auth[0];
    const password = auth[1];

    //check email and password
    if (!validateCredentials.validateEmail(email) || !validateCredentials.validatePassword(password)) {
      res.sendStatus(400);
      return;
    }

    //Create unified userData with email and password
    const userData = { ...req.body };

    //Check if userData contains firstname and lastname
    if (!userData.firstname || !userData.lastname) {
      res.sendStatus(400);
      return;
    }

    //Add email and password to userData
    userData.email = email;
    userData.password = password;

    //writes new user into database
    userController.createUser(res, userData);
  } else {
    res.sendStatus(400);
  }
})

const userHandlers = {
  getUser: getUser,
  deleteUser: deleteUser,
  registerUser: registerUser
}

module.exports = userHandlers;