const User = require('../models/user');

async function createUser(res, { firstname, lastname, email, password, industryStatus }) {

  try {
    //Create new user with given parameters
    const response = await User.create({
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: password,
      industry_status: industryStatus,
    })

    //Convert to JSON
    const package = response.toJSON();
    //Send status code 201 to client
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    console.log("User not Created");

    //Bad Request via Client
    res.sendStatus(400);
  }
}

async function deleteUser(res, userID) {
  try {
    //Delete user from database
    const response = await User.destroy({
      where: {
        id: userID
      }
    });

    console.log("User Deleted");
    //Send status for successful deletion
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    console.log("Could not delete user");
    res.sendStatus(404);
  }
}

async function fetchUserInfo(res, email, password) {
  try {
    const userInfo = await User.findAll({
      where: {
        email: email,
        password: password
      }
    })

    //If userInfo is empty
    //No user is found, send 404 since resource is not found
    if (!userInfo.length) {
      console.log('User Info not Found');
      res.sendStatus(404);
      return;
    }

    console.log('User Info Found');
    res.send(userInfo);
  } catch (error) {
    console.log(error);
    console.log('User Info not Found');
    res.sendStatus(404);
  }
}

//Package controller methods in an object
const userController = {
  createUser: createUser,
  deleteUser: deleteUser,
  fetchUserInfo: fetchUserInfo
}

//Export Methods
module.exports = userController;