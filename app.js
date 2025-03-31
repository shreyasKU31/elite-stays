const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
var methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

// Route to show a form for creating a new listing
app.get("/listings/new", (req, res) => {
  res.render("createList.ejs");
});
app.post("/listings", async (req, res) => {
  const { title, discription, image, price, location, country } = req.body;
  let listing = new Listing({
    title,
    discription,
    image,
    price,
    location,
    country,
  });
  await listing.save();
  res.redirect("/listings");
});

//Route to get all the listings data from DB
app.get("/listings", async (req, res) => {
  await Listing.find().then((r) => {
    let listings = r;
    res.render("listings.ejs", { listings });
  });
});

//Route to show a listing in detail
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findById(id)
    .then((r) => {
      const list = r;
      res.render("list.ejs", { list });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  await Listing.findById(id)
    .then((r) => {
      let editList = r;
      res.render("edit.ejs", { editList });
    })
    .catch((err) => console.log(err));
});
//Udate Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  // console.log(req.body);
  await Listing.findByIdAndUpdate(id, req.body);
  res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
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
