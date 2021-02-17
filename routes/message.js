const express = require("express");
const router = express.Router();
const message = require("../controllers/message");
const { isLoggedIn, isAdmin } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(message.displayMessages));

router.get("/newmessage", isLoggedIn, message.newMessageForm);

router.post("/newmessage", isLoggedIn, catchAsync(message.saveNewMessage));

router.delete(
  "/delete/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(message.deleteMessage)
);

module.exports = router;
