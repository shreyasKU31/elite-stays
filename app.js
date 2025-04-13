const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine("ejs", ejsmate);

//Connecting to DB
const MONGO_URL = "mongodb://localhost:27017/elitestays";
async function connect() {
  await mongoose.connect(MONGO_URL);
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

app.use("/listings", listings); //Listing Route
app.use("/listings/:id/review", reviews); //Review Route

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
