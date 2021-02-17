const mongoose = require("mongoose");
const User = require("./user");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: User
  },
});

module.exports = new mongoose.model("Message", messageSchema);
