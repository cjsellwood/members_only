module.exports.isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {

  if (!req.user.isAdmin) {
    return res.redirect("/")
  }
  next();
}