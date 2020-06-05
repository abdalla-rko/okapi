const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (username, email, password) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(60).required(),
    email: Joi.string().min(6).max(80).required().email(),
    password: Joi.string().min(6).max(80).required()
  })
  return schema.validate({username, email, password});
}

// login
const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(80).required().email(),
    password: Joi.string().min(6).max(80).required()
  })
  return schema.validate(data);
}

module.exports = {
  registerValidation,
  loginValidation
}