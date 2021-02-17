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

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user and save to database
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  // If mongoose error flash error and show register form again
  try {
    await newUser.save();
  } catch(err) {
    if (err.code === 11000) {
      req.flash("error", "User already exists")
    } else {
      req.flash("error", "Something went wrong")
    }
    return res.redirect("/register")
  }

  // Flash message
  req.flash("success", "Registered and logged in")

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
module.exports.loginUser = (req, res) => {
  const url = req.session.returnTo || "/"
  req.flash("success", "Logged In")
  res.redirect(url);
};

// Get user logout route
module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Logged Out")
  res.redirect("/");
};

// Get become member form
module.exports.membershipForm = (req, res) => {
  res.render("user/membership");
};

// Patch in membership status to true if code was correct
module.exports.becomeMember = async (req, res, next) => {
  const { secret } = req.body;

  if (secret !== process.env.SECRET_CODE) {
    req.flash("error", "Wrong Code")
    return res.redirect("/membership");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    isMember: true,
  });
  req.flash("success", "You are now a member")
  res.redirect("/");
};

// Get become admin form
module.exports.AdminForm = async (req, res, next) => {
  res.render("user/admin");
}

// Patch in admin status to true if code was correct
module.exports.becomeAdmin = async (req, res, next) => {
  const { secret } = req.body;

  if (secret !== process.env.ADMIN_CODE) {
    req.flash("error", "Wrong Code")
    return res.redirect("/admin");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    isAdmin: true,
  });

  req.flash("success", "You are now an Admin")
  res.redirect("/");
};