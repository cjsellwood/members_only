const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.get("/register", user.registerForm);

router.post("/register", catchAsync(user.registerUser));

router.get("/login", user.loginForm);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  user.loginUser
);

router.get("/logout", user.logoutUser);

router.get("/membership", isLoggedIn, user.membershipForm);

router.patch("/membership", isLoggedIn, catchAsync(user.becomeMember));

router.get("/admin", isLoggedIn, user.AdminForm);

router.patch("/admin", isLoggedIn, catchAsync(user.becomeAdmin));

module.exports = router;
