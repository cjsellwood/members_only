const express = require("express");
const router = express.Router();
const message = require("../controllers/message");
const { isLoggedIn, isAdmin } = require("../middleware");

router.get("/", message.displayMessages);

router.get("/newmessage", isLoggedIn, message.newMessageForm);

router.post("/newmessage", isLoggedIn, message.saveNewMessage);

router.delete("/delete/:id", isLoggedIn, isAdmin, message.deleteMessage);

module.exports = router;
