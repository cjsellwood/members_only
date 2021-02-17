if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env.NODE_ENV);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const compression = require("compression");
const helmet = require("helmet");

// Mongoose models
const User = require("./models/user");
const Message = require("./models/message");

// Routers
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");

// Use local database in development mode
let dbURL = process.env.DB_URL;
if (process.env.NODE_ENV !== "production") {
  dbURL = "mongodb://localhost/members_only";
}

// Connect to mongo database
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to database");
});

// middleware
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(compression());
app.use(helmet());

// Session info
const sessionSecret = process.env.SESSION_SECRET || "sessionsecret";
const sessionConfig = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));

app.use(flash());

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
  // Save flash to locals
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Imported routes
app.use("/", userRouter);
app.use("/", messageRouter);

// Handle Page not found
app.use("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Handle errors
app.use((err, req, res, next) => {
  console.log(err);
  if (!err.statusCode) {
    err.message = "Something went wrong";
    err.statusCode = 500;
  }
  res.status(err.statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on Port " + port);
});
