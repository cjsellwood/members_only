const mongoose = require("mongoose");

const User = require("./models/user");
const Message = require("./models/message");

const dbURL = "mongodb://localhost/members_only";
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to database");
});

