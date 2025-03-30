const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

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

//Routes
//Route for home
app.get("/", (req, res) => {
  res.send("This is a root page");
});

//Route to get all the listings data from DB
app.get("/listings", (req, res) => {
  Listing.find().then((r) => {
    let listings = r;
    res.render("listings.ejs", { listings });
  });
});

//Route to show a listing in detail
app.get("/listings/:id", (req, res) => {
  const { id } = req.params;
  Listing.findById(id).then((r) => {
    const list = r;
    res.render("list.ejs", { list });
  });
});

//Route to test DB listing
// app.get("/testlisting", async (req, res) => {
//   let listing = new Listing({
//     title: "Test Listing",
//     description: "this is a hotel in banglore near majestic",
//     image: "",
//     price: 3000,
//     location: "Banglore",
//     country: "India",
//   });

//   await listing.save();
//   console.log("Listing is done");
//   res.send("Yes happy listing");
// });
app.listen(8000, () => {
  console.log("Server is running at port 8000");
});
