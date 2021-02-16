const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");

// Mongoose models
const User = require("./models/user");
const Message = require("./models/message");

// Routers
const userRouter = require("./routes/user");
const { urlencoded } = require("body-parser");

// Connect to mongo database
const dbURL = "mongodb://localhost/members_only";
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to database");
});

// middleware
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));

// Session info
const sessionConfig = {
  secret: "sessionsecret",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  })
);

// Store user details
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Get user details from database
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Save user to locals for use in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Imported routes
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
