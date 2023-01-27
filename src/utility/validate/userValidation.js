function validateEmail(email) {
  //check length
  if (email.length) {
    let symbolIndex = email.indexOf('@');
    //Check if @ symbol exists &&
    //Check if email does not end with .com,.tech or .net;
    if (!symbolIndex) {
      return false;
    }
    if (!email.endsWith('.com')) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}


function validatePassword(password) {
  if (password.length >= 8) {
    const capitalRegex = /[A-Z]/;
    // const symbolRegex = /[.,!?^&@#$%*()_+={}[]-]/;
    const symbolRegex = /[^\w\*]/;
    const numberRegex = /[0-9]/;

    let capitalIndex = password.search(capitalRegex);
    let symbolIndex = password.search(symbolRegex);
    let numberIndex = password.search(numberRegex);

    if (capitalIndex < 0 || symbolIndex < 0 || numberIndex < 0) {
      return false;
    }

  } else {
    return false;
  }

  return true;
}

const validateCredentials = {
  validateEmail: validateEmail,
  validatePassword: validatePassword
}

module.exports = validateCredentials;