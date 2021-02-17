const Joi = require("joi");

module.exports.userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref("password"),
}).required();

module.exports.messageSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required().min(10),
}).required();
