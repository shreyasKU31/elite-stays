const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

// Route to show a form for creating a new listing
router.get("/new", (req, res) => {
  res.render("createList.ejs");
});
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
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
router.get(
  "/",
  wrapAsync(async (req, res) => {
    await Listing.find().then((r) => {
      let listings = r;
      res.render("listings.ejs", { listings });
    });
  })
);

//Route to show a listing in detail
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");
    res.render("list.ejs", { list });
  })
);

//Edit route
router.get(
  "/:id/edit",
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
router.put(
  "/:id",
  validateListing,
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

//Delete Listing route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
