const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

// Get register new user form
module.exports.registerForm = (req, res) => {
  res.render("user/register");
};

// Post new user from form data
module.exports.registerUser = async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;

  // #TODO - Show to user somehow
  // If passwords don't match return to register form
  if (password !== confirmPassword) {
    return res.redirect("/register");
  }

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user and save to database
  const newUser = new User({
    username,
    password: hashedPassword,
  });
  await newUser.save();

  // Login user
  req.login(newUser, (err) => {
    if (err) return next(err);
  });

  // Go back to home page
  res.redirect("/");
};

// Get login form
module.exports.loginForm = (req, res) => {
  res.render("user/login");
};

// Post data from login form to login user
module.exports.loginUser = (req, res, next) => {
  res.redirect("/");
};

// Get user logout route
module.exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect("/");
};

// Get become member form
module.exports.membershipForm = (req, res) => {
  res.render("user/membership");
};

module.exports.becomeMember = async (req, res, next) => {
  const { secret } = req.body;
  // #TODO replace with env variable and show they were wrong
  if (secret !== "secret") {
    return res.redirect("/membership");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    isMember: true,
  });
  res.redirect("/");
};
