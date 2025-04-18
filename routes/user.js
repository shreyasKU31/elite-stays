const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  signup,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/users.js");

router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(signup));

router.get("/login", renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

router.get("/logout", logout);

module.exports = router;
