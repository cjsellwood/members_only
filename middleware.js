const { userSchema, messageSchema } = require("./joi");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.redirect("/");
  }
  next();
};

module.exports.validateUser = (req, res, next) => {
  console.log(req.body);
  next();
};

module.exports.validateMessage = (req, res, next) => {
  console.log(req.body);
  const isValid = messageSchema.validate(req.body);
  console.log(isValid.error.details);
  if (isValid.error) {
    throw new ExpressError(
      isValid.error.details.map((error) => error.message).join(",")
    , 400);
  }
  next();
};
