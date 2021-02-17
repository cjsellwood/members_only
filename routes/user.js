const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const passport = require("passport");

router.get("/register", user.registerForm);

router.post("/register", user.registerUser);

router.get("/login", user.loginForm);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  user.loginUser
);

router.get("/logout", user.logoutUser);

router.get("/membership", user.membershipForm);

router.patch("/membership", user.becomeMember);
module.exports = router;
