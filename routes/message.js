const express = require("express");
const router = express.Router();
const message = require("../controllers/message");

router.get("/", message.displayMessages)

router.get("/newmessage", message.newMessageForm);

router.post("/newmessage", message.saveNewMessage);

module.exports = router;
