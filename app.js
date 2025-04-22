const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine("ejs", ejsmate);

//Connecting to DB
async function connect() {
  await mongoose.connect(process.env.MONGO_URL);
}
connect()
  .then(() => {
    console.log("Database is sucessfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Route for home
app.get("/", (req, res) => {
  res.send("This is a root page");
});

// ************************************************** Sessions **************************************************
const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ************************************************** Passport **************************************************
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ************************************************** Routers **************************************************

app.use("/listings", listingsRouter); //Listing Route
app.use("/listings/:id/review", reviewsRouter); //Review Route
app.use("/", userRouter); //Review Route

// ************************************************** Errors **************************************************
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

//Error Route
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something is wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8000, () => {
  console.log("Server is running at port 8000");
});
