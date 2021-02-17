const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

router.get("/register", user.registerForm);

router.post("/register", user.registerUser);

router.get("/login", user.loginForm);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  user.loginUser
);

router.get("/logout", user.logoutUser);

router.get("/membership", isLoggedIn, user.membershipForm);

router.patch("/membership", isLoggedIn, user.becomeMember);

router.get("/admin", isLoggedIn, user.AdminForm);

router.patch("/admin", isLoggedIn, user.becomeAdmin);

module.exports = router;
