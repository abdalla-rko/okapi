const User = require('../models/User');
const {createJsonWebToken} = require('../config/jwtToken');
const { loginValidation, registerValidation } = require('./validation');
const bcrypt = require('bcrypt');

async function loginUser(email, password, res) {
  const { error } = loginValidation({email, password});
  if (error) return error.details[0].message;

  const user = await User.findOne({email: email})
  if (!user) return 'Email or password is invalid';
  try {
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) return 'Email or password is invalid';
    await createJsonWebToken(email, res);
  } catch (err) {
    return console.error(err);
  }
}

async function registerUser(username, email, password, res) {
  const { error } = registerValidation(username, email, password);
  if (error) return error.details[0].message;
  
    // todo: better error handeling
  const emailExist = await User.findOne({email: email});
  if (emailExist) return 'Email already exists';
  
  const saltRounds = 10;
  
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const user = new User({
      username: username,
      email: email,
      password: hash
    });
  
    try {
      await user.save();
      createJsonWebToken(user.email, res)
    } catch (err) {
      console.error(err)
    }
  });
}



module.exports = {
  registerUser,
  loginUser
}