const User = require('../models/user');

async function createUser(res, { firstname, lastname, email, password, industryStatus }) {

  try {
    const response = await User.create({
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: password,
      industry_status: industryStatus,
    })

    const package = response.toJSON();
    res.send(package);
  } catch (error) {
    console.log(error);
    console.log("User not Created");
    res.sendStatus(400);
  }
}

async function deleteUser(res, userID) {
  try {
    const response = await User.destroy({
      where: {
        id: userID
      }
    });

    console.log("User Deleted");
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


const userController = {
  createUser: createUser,
  deleteUser: deleteUser,
  fetchUserInfo: fetchUserInfo
}

module.exports = userController;