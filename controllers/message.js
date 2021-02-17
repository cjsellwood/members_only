const Message = require("../models/message");

// Get Home page with messages
module.exports.displayMessages = async (req, res, next) => {
  const messages = await Message.find({}).populate("author", "username");
  res.render("index", {messages});
}


// Get new message form
module.exports.newMessageForm = (req, res) => {
  res.render("message/newmessage");
};

// Post new message to database
module.exports.saveNewMessage = async (req, res, next) => {
  const { title, text } = req.body;
  console.log(req.user);
  const newMessage = new Message({
    title,
    text,
    time: Date.now(),
    author: req.user._id,
  });
  await newMessage.save();
  console.log(newMessage);
  res.redirect("/")
};
