const { userSchema, messageSchema } = require("./joi");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.user) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
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
  const isValid = userSchema.validate(req.body);
  if (isValid.error) {
    const message = isValid.error.details
      .map((error) => error.message)
      .join(",");
    req.flash("error", message);
    // throw new ExpressError(message, 400);
    res.redirect("/register")
  }
  next();
};

module.exports.validateMessage = (req, res, next) => {
  const isValid = messageSchema.validate(req.body);
  if (isValid.error) {
    throw new ExpressError(
      isValid.error.details.map((error) => error.message).join(","),
      400
    );
  }
  next();
};
