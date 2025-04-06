const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
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

//Routes
//Route for home
app.get("/", (req, res) => {
  res.send("This is a root page");
});

// Route to show a form for creating a new listing
app.get("/listings/new", (req, res) => {
  res.render("createList.ejs");
});
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    if (!req.body) {
      throw new ExpressError(
        400,
        "Ivalid form data. Please fill all the fields."
      );
    }
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
  })
);

//Route to get all the listings data from DB
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    await Listing.find().then((r) => {
      let listings = r;
      res.render("listings.ejs", { listings });
    });
  })
);

//Route to show a listing in detail
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findById(id)
      .then((r) => {
        const list = r;
        res.render("list.ejs", { list });
      })
      .catch((err) => {
        console.log(err);
      });
  })
);

//Edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findById(id)
      .then((r) => {
        let editList = r;
        res.render("edit.ejs", { editList });
      })
      .catch((err) => console.log(err));
  })
);
//Udate Route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body) {
      throw new ExpressError(
        400,
        "Ivalid form data. Please fill all the fields."
      );
    }
    let { id } = req.params;
    // console.log(req.body);
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

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
