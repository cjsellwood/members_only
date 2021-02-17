const Joi = require("joi");

module.exports.userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string(),
  confirmPassword: Joi.valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
  }),
}).required();

module.exports.messageSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
}).required();
