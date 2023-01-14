const express = require('express');
const app = express();
const userController = require('../controllers/user');

const getUser = express.Router();
const deleteUser = express.Router();
const registerUser = express.Router();

app.use(express.json());

getUser.get('/signin', (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    userController.fetchUserInfo(res, username, password);
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
    const username = auth[0];
    const password = auth[1];
    
    //Create unified userData with email and password
    const userData = { ...req.body };

    userData.email = username;
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